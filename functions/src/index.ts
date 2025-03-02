import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updatePaidProjects = functions.https.onRequest(async (req, res): Promise<void> => {
    const userId = req.query.userId as string;
    const projectId = req.query.projectId as string;
    const tranId = req.query.tranId as string;
    const referer = req.query.referer as string || req.get('referer'); // Prioritize the custom referer URL

    if (!userId || !projectId || !referer) {
        res.status(400).send('Missing userId, projectId, or referer');
        return;
    }

    try {
        const userRef = admin.database().ref(`users/${userId}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val();

        if (userData && userData.projects) {
            const projectIndex = userData.projects.findIndex((project: any) => project.projectId === projectId);
            if (projectIndex !== -1) {
                userData.projects[projectIndex].paid = true;
                userData.projects[projectIndex].tranId = tranId;
                await userRef.update({ projects: userData.projects });
                const redirectUrl = `${referer}/assets/dashboard?status=success&projectId=${projectId}&userId=${userId}`;
                res.redirect(302, redirectUrl);
            } else {
                res.status(404).send('Project not found');
            }
        } else {
            res.status(404).send('User or projects not found');
        }
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).send('Internal Server Error');
    }
});
