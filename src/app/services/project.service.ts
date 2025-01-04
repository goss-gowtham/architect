import { Injectable } from '@angular/core';
import { ref, get, update } from "firebase/database";
import { from, Observable } from 'rxjs';
import { CardDTO } from '../models/clients.dto';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private database;

    constructor(private firebaseService: FirebaseService) {
        this.database = this.firebaseService.getDatabase();
    }

    addProjectToUser(userId: string, project: CardDTO): Observable<void> {
        const dbRef = ref(this.database, `users/${userId}/projects`);
        return from(get(dbRef).then((snapshot) => {
            const projects = snapshot.exists() ? snapshot.val() : [];
            projects.push({
                ...project,
                projectId: project.projectId,
                paid: project.paid || false
            });
            return update(ref(this.database, `users/${userId}`), { projects });
        }).catch((error) => {
            console.error("Error adding project to user:", error);
            throw error;
        }));
    }

    deleteProject(userId: string, projectId: string): Observable<void> {
        const dbRef = ref(this.database, `users/${userId}/projects`);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const projects = snapshot.val();
                const updatedProjects = projects.filter((project: any) => project.projectId !== projectId);
                return update(ref(this.database, `users/${userId}`), { projects: updatedProjects });
            } else {
                throw new Error("No projects found for the user");
            }
        }).catch((error) => {
            console.error("Error deleting project:", error);
            throw error;
        }));
    }

    updateProjectPaymentStatus(userId: string, projectId: string, paid: boolean): Observable<void> {
        const dbRef = ref(this.database, `users/${userId}/projects`);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const projects = snapshot.val();
                const updatedProjects = projects.map((project: any) => {
                    if (project.projectId === projectId) {
                        return { ...project, paid };
                    }
                    return project;
                });
                return update(ref(this.database, `users/${userId}`), { projects: updatedProjects });
            } else {
                throw new Error("No projects found for the user");
            }
        }).catch((error) => {
            console.error("Error updating project payment status:", error);
            throw error;
        }));
    }
}