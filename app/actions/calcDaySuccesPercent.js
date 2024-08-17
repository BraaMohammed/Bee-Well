'use server'

function calculateDailyRating(dailyEntry, trackedHabbits) {
  let totalScore = 0;
  let totalHabits = 0;

  console.log(trackedHabbits)

  trackedHabbits.habbits.forEach((category, categoryIndex) => {
    category.elements.forEach((element, elementIndex) => {
      if (['checkList', 'numberInput', 'select'].includes(element.type)) {
        totalHabits++;
        
        // Find corresponding entry in dailyEntry
        const categoryEntry = dailyEntry.entries.find(e => e.categoryIndex === categoryIndex);
        const elementEntry = categoryEntry?.elements.find(e => e.elementIndex === elementIndex);

        if (elementEntry) {
          switch (element.type) {
            case 'checkList':
              totalScore += elementEntry.userInput ? 1 : 0;
              break;
            case 'numberInput':
              const targetValue = parseFloat(element.target);
              const userValue = parseFloat(elementEntry.userInput);
              if (!isNaN(targetValue) && !isNaN(userValue)) {
                if (targetValue === userValue) {
                  totalScore += 1;
                } else {
                  const difference = Math.abs(targetValue - userValue);
                  const maxDifference = Math.max(targetValue, 1); // Prevent division by zero
                  const score = Math.max(0, 1 - (difference / maxDifference));
                  totalScore += score;
                }
              }
              break;
            case 'select':
              totalScore += elementEntry.userInput === element.target ? 1 : 0;
              break;
          }
        }
        // If no entry found, score is implicitly 0
      }
    });
  });

  if (totalHabits === 0) {
    return 0; // Return 0 if there are no habits to avoid division by zero
  }

  const overallScore = (totalScore / totalHabits) * 100;
  return Math.round(overallScore);
}

export default calculateDailyRating;


/*
function calculateDailyRating(dailyEntry) {
    let totalScore = 0;
    let totalElements = 0;
    if (dailyEntry && dailyEntry.entries) {
        dailyEntry.entries.forEach(category => {
            category.elements.forEach(element => {
           

                switch (element.elementType) {
                    case 'checkList':
                        totalScore += element.userInput ? 1 : 0;
                        totalElements++;
                        break;
                    case 'numberInput':
                        const targetValue = parseFloat(element.target);
                        const userValue = parseFloat(element.userInput);
                        const difference = Math.abs(targetValue - userValue);
                        const maxDifference = targetValue; // Changed to 100% of target
                        const score = Math.max(0, 1 - (difference / maxDifference));
                        totalScore += score;
                        totalElements++;
                        break;
                    case 'select':
                        totalScore += element.userInput === element.target ? 1 : 0;
                        totalElements++;
                        break;
                }
            });
        });

        const overallScore = (totalScore / totalElements) * 100;
        return Math.round(overallScore);
    }


}



*/