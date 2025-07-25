
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// Schema for form data validation
const opportunitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  type: z.enum(['MUN', 'Internship', 'Volunteering', 'Competition', 'Bootcamp', 'Hackathon', 'Workshop']),
  description: z.string().min(20),
  subject: z.string().min(2),
  grades: z.array(z.string()).min(1),
  price: z.enum(['Free', 'Paid']),
  audience: z.enum(['All Nationalities', 'Emiratis Only']),
  format: z.enum(['Online', 'Offline']),
  deadline: z.date(),
  emirate: z.enum(["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain", "All Emirates"]),
  registrationLink: z.string().url().optional().or(z.literal('')),
  detailsLink: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export async function createOrUpdateOpportunity(
    formData: z.infer<typeof opportunitySchema>,
    userId: string,
    userRole: 'admin' | 'student'
) {
    try {
        const validatedData = opportunitySchema.parse(formData);
        
        const dataToSave = {
            ...validatedData,
            deadline: Timestamp.fromDate(validatedData.deadline),
            grades: validatedData.grades.map(Number).sort((a,b) => a - b),
            summary: validatedData.description.substring(0, 100) + '...'
        };

        if (validatedData.id) {
            // Update existing opportunity
            const oppRef = doc(db, 'opportunities', validatedData.id);
            const existingOpp = await getDoc(oppRef);
            if (!existingOpp.exists()) {
                return { success: false, error: "Opportunity not found." };
            }

            const currentStatus = existingOpp.data().status;
            
            await updateDoc(oppRef, {
                ...dataToSave,
                // Admin can edit without changing status, student edits require re-approval
                status: userRole === 'admin' ? currentStatus : 'pending'
            });
        } else {
            // Create new opportunity
            await addDoc(collection(db, 'opportunities'), {
                ...dataToSave,
                submittedBy: userId,
                createdAt: serverTimestamp(),
                status: userRole === 'admin' ? 'approved' : 'pending'
            });
        }

        revalidatePath('/dashboard');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: "Validation failed: " + error.errors.map(e => e.message).join(', ') };
        }
        console.error("Firebase error:", error);
        return { success: false, error: 'An unexpected error occurred on the server.' };
    }
}

export async function deleteOpportunity(id: string) {
    try {
        await deleteDoc(doc(db, 'opportunities', id));
        revalidatePath('/dashboard');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Firebase error:", error);
        return { success: false, error: 'Failed to delete opportunity.' };
    }
}

export async function updateOpportunityStatus(id: string, status: 'approved' | 'rejected') {
     try {
        if (status === 'rejected') {
            await deleteOpportunity(id);
        } else {
            await updateDoc(doc(db, 'opportunities', id), { status });
        }
        revalidatePath('/dashboard');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Firebase error:", error);
        return { success: false, error: 'Failed to update status.' };
    }
}
