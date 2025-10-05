import { v4 } from "uuid"
import { supabase } from "../../lib/supabase/supabase"
import { SingleHabbitsType } from "@/types/habbitsRelatedTypes"
const userId = '20f55818-8f1e-40fe-a045-a7c891f2038f'
const deenCategoryId = 'ffc6099b-46f4-4f2f-a2f1-cfaf8d065093'
const lookCategoryId = '24c2a4fa-32d1-439f-babe-ccb6414d9f8c'
const fitnessCategoryId = 'bb19b12f-d72d-4fd6-91af-9f3edd7fdcfc'
const workCategoryId = '75fe2a93-e01f-4740-9e92-426b44257bae'


const trackedHabbits = {
  "_id": "66a8c60048fa93f2f4e230b7",
  "userEmail": "braamody212@gmail.com",
  "habbits": [
    {
      "categoryName": "Deen",
      "elements": [
        {
          "type": "checkList",
          "text": "500 zekr per day",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4381"
        },
        {
          "type": "checkList",
          "text": " Azkar Sobh",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4382"
        },
        {
          "type": "checkList",
          "text": "Azkar Lel",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4383"
        },
        {
          "type": "checkList",
          "text": " Werd Read",
          "options": [],
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4384"
        },
        {
          "type": "checkList",
          "text": "Werd Hefz",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4385"
        },
        {
          "type": "checkList",
          "text": " Qyam Lel Previous Day",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4386"
        },
        {
          "type": "checkList",
          "text": " Do3a`",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4387"
        },
        {
          "type": "checkList",
          "text": " Syam",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4388"
        },
        {
          "type": "checkList",
          "text": " Sdaqa",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4389"
        },
        {
          "type": "checkList",
          "text": " Drs Deen",
          "options": [],
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd438b"
        },
        {
          "type": "checkList",
          "text": " Doha + Sunnet Fajr",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd438c"
        },
        {
          "type": "numberInput",
          "text": "   Salawat Fel Masjed",
          "options": [],
          "target": "5",
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0fa1b3145edb874d8b6da"
        }
      ],
      "_id": "66c0716d04bf6c486fdd4380"
    },
    {
      "categoryName": "Look & Self Dev",
      "elements": [
        {
          "type": "checkList",
          "text": "emotinal prep(SOPS , Goals ,Avoid)",
          "options": [],
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd438e"
        },
        {
          "type": "numberInput",
          "text": "Good Eating Rating",
          "options": [],
          "target": "100",
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd438f"
        },
        {
          "type": "numberInput",
          "text": "   Water Intake Liters Aprx",
          "options": [],
          "target": "5",
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4390"
        },
        {
          "type": "numberInput",
          "text": "      How Many Hammam",
          "options": [],
          "target": "3",
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4393"
        },
        {
          "type": "checkList",
          "text": "Slept Apx 8 Hours",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0724b04bf6c486fdd478e"
        },
        {
          "type": "checkList",
          "text": " ⚠️ ",
          "options": [],
          "importance": 1,
          "shouldBeDone": false,
          "_id": "66f4777e47ba72a72bf9da57"
        },
        {
          "type": "checkList",
          "text": "Jornaling",
          "options": [],
          "importance": 1,
          "shouldBeDone": true,
          "_id": "6766d92df4ee129791b8f796"
        },
        {
          "type": "numberInput",
          "text": "   Look Improving Rating",
          "options": [],
          "target": "10",
          "importance": 1,
          "shouldBeDone": true,
          "_id": "67840310ac31a9ae14714ccb"
        }
      ],
      "_id": "66c0716d04bf6c486fdd438d"
    },
    {
      "categoryName": "Fitness",
      "elements": [
        {
          "type": "checkList",
          "text": "Trained Today",
          "options": [],
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4398"
        },
        {
          "type": "checkList",
          "text": " Did Streches + Corrective",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd4399"
        },
        {
          "type": "numberInput",
          "text": "   Walking Today Km",
          "options": [],
          "target": "4",
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd439a"
        },
        {
          "type": "select",
          "text": "   How Good Was The Workout",
          "options": [
            "Great !",
            "Normal"
          ],
          "target": "Great !",
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd439b"
        }
      ],
      "_id": "66c0716d04bf6c486fdd4397"
    },
    {
      "categoryName": "Work & Study",
      "elements": [
        {
          "type": "numberInput",
          "text": "   Number Of Hours Before Duhr",
          "options": [],
          "target": "4",
          "importance": 0.875,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd439d"
        },
        {
          "type": "numberInput",
          "text": "   Total Working Hours",
          "options": [],
          "target": "8",
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd439e"
        },
        {
          "type": "numberInput",
          "text": "   Number Of Achived Goals",
          "options": [],
          "target": "3",
          "importance": 0.875,
          "shouldBeDone": true,
          "_id": "66c0716d04bf6c486fdd439f"
        },
        {
          "type": "checkList",
          "text": "   Have Goals Today + Set Time Block",
          "options": [],
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66d3858765d1ebe80d4fb6a1"
        },
        {
          "type": "checkList",
          "text": "  Tracked Working Hours + Worked With Timer",
          "options": [],
          "importance": 1,
          "shouldBeDone": true,
          "_id": "66d3858765d1ebe80d4fb6a2"
        },
        {
          "type": "checkList",
          "text": "   Books Studying / Knowledge Video",
          "options": [],
          "importance": 0.75,
          "shouldBeDone": true,
          "_id": "679617f2b41bc391ce54ec4a"
        }
      ],
      "_id": "66c0716d04bf6c486fdd439c"
    }
  ],
  "__v": 32
}

const mapCategoryNameToId = (categoryName: string) => {
    switch(categoryName){
        case "Deen":
            return deenCategoryId
        case "Look & Self Dev":
            return lookCategoryId
        case "Fitness":
            return fitnessCategoryId
        case "Work & Study":
            return workCategoryId
        default:
            return null
    }

}

export const importTrackedHabbitsToDb = async () => {
    const dataToInsert: SingleHabbitsType[] = [];

    trackedHabbits.habbits.forEach((category) => {
        const categoryId = mapCategoryNameToId(category.categoryName);
        category.elements.forEach((habbit, idx) => {
            let type: 'select' | 'input' | 'checkbox';
            if (habbit.type === 'numberInput') type = 'input';
            else if (habbit.type === 'select') type = 'select';
            else type = 'checkbox';

            dataToInsert.push({
                id: habbit._id,
                name: habbit.text.trim(),
                uiOrder: idx,
                categoryId: categoryId ?? '',
                type,
                options: habbit.options && habbit.options.length > 0 ? habbit.options : undefined,
                target: habbit.type === 'numberInput' || habbit.type === 'select' ? habbit.target : undefined,
                importance: String(habbit.importance) as '1' | '0.875' | '0.75' | '0.625 ' | '0.5',
                shouldBeDone: habbit.shouldBeDone , 
                userId: userId
            });
        });
    });

    dataToInsert.map(async (habbit) => {
        const {data:insertedData, error} = await supabase
        .from('single_habbits')
        .insert(habbit)

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Inserted data:', insertedData);
        }
    })
      
}


