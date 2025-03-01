import { Injectable } from '@angular/core';
import { ref, get, update } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { from, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CardDTO } from '../models/clients.dto';
import { FirebaseService } from './firebase.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private database;
    private storage;

    constructor(private firebaseService: FirebaseService, private http: HttpClient, private userService: UserService) {
        this.database = this.firebaseService.getDatabase();
        this.storage = this.firebaseService.getStorage();
    }

    addProjectToUser(userId: string, project: CardDTO): Observable<void> {
        const dbRef = ref(this.database, `users/${userId}/projects`);
        return from(get(dbRef).then((snapshot) => {
            const projects = snapshot.exists() ? snapshot.val() : [];
            projects.push({
                ...project,
                projectId: project.projectId,
                paid: project.paid || false,
                addedDate: project.addedDate || new Date() // Ensure addedDate is included as Date object
            });
            return update(ref(this.database, `users/${userId}`), { projects });

        }).catch((error) => {
            console.error("Error adding project to user:", error);
            throw error;
        }));
    }

    deleteProject(userId: string, projectId: string): Observable<void> {
        if (!userId) throw new Error("User ID cannot be null");
        const dbRef = ref(this.database, `users/${userId}/projects`);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const projects = snapshot.val();
                const project = projects.find((project: any) => project.projectId === projectId);
                if (project) {
                    const fileRef = storageRef(this.storage, project.file);
                    return deleteObject(fileRef).then(() => {
                        const updatedProjects = projects.filter((project: any) => project.projectId !== projectId);
                        return update(ref(this.database, `users/${userId}`), { projects: updatedProjects });
                    });
                } else {
                    throw new Error("Project not found");
                }
            } else {
                throw new Error("No projects found for the user");
            }
        }).then(() => {
            console.log("Project and associated file deleted successfully");
        }).catch((error) => {
            console.error("Error deleting project:", error);
            throw error;
        }));
    }

    updateProject(userId: string, project: CardDTO): Observable<void> {
        if (!userId) throw new Error("User ID cannot be null");
        const dbRef = ref(this.database, `users/${userId}/projects`);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const projects = snapshot.val();
                const updatedProjects = projects.map((p: any) => {
                    if (p.projectId === project.projectId) {
                        return project;
                    }
                    return p;
                });
                return update(ref(this.database, `users/${userId}`), { projects: updatedProjects });
            } else {
                throw new Error("No projects found for the user");
            }
        }).catch((error) => {
            console.error("Error updating project:", error);
            throw error;
        }));
    }

    updateProjectPaymentStatus(userId: string, projectId: string, paid: boolean): Observable<void> {
        if (!userId) throw new Error("User ID cannot be null");
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

    downloadFile(fileUrl: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return this.http.get(fileUrl, { headers, responseType: 'blob' });
    }
}