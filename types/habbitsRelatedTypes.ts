


export type CategoryType = {
    id: string;
    userId: string;
      uiOrder: number;
    name: string;
    habbitsIds: string[];//ids of inner habbits
}



export type SingleHabbitsType = {
   id: string;
   name: string;
   uiOrder: number; // order of the habbit in the category , may be equivlent to habbit index on the current ui 
   categoryId: string; // id of the category
   type: 'select' | 'input' | 'checkbox' ; 
   options?: string[]; // for select and checkbox
   target?: string; // for input
   importance : '1' | '0.875'  | '0.75' | '0.625 '|'0.5'; // 1-5
   shouldBeDone: boolean; // if the habbit should be done or not
       userId: string;

}


export type habbitDbResponseType = {
    id: string;
    userEmail: string;
    userId: string;
    userCattegories : CategoryType[]
    userHabbits : SingleHabbitsType[]
}

