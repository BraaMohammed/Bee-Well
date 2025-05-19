
export type NoteType = {
    id: string;
    user_id: string;
    heading: string;
    content: string;
    created_at: string; // ISO date string
    labelName: string; // ISO date string
    backgroundColor: string | 'rgb(64 64 64)'; // ISO date string 
    htmlContent: string;
}
