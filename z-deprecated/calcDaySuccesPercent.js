'use client'


function calculateDailyRating(dailyEntry, trackedHabbits) {

  
  let totalScore = 0;


  let totalWeight = 0;

  console.log(trackedHabbits);

  trackedHabbits.habbits.forEach((category, categoryIndex) => {
    category.elements.forEach((element, elementIndex) => {
      if (['checkList', 'numberInput', 'select'].includes(element.type)) {
        const importance = element.importance || 0.75; // Default to 0.75 if not set
        totalWeight += importance;
        
        // Find corresponding entry in dailyEntry
        const categoryEntry = dailyEntry.entries.find(e => e.categoryIndex === categoryIndex);
        const elementEntry = categoryEntry?.elements.find(e => e.elementIndex === elementIndex);

        if (elementEntry) {
          let score = 0;
          switch (element.type) {
            case 'checkList':
              const shouldBeDone = element.shouldBeDone !== undefined ? element.shouldBeDone : true;
              score = (elementEntry.userInput === shouldBeDone) ? 1 : 0;
              break;
            case 'numberInput':
              const targetValue = parseFloat(element.target);
              const userValue = parseFloat(elementEntry.userInput);
              if (!isNaN(targetValue) && !isNaN(userValue)) {
                if (userValue >= targetValue) {
                  score = 1; // Full score if user meets or exceeds target
                } else {
                  const difference = targetValue - userValue;
                  const maxDifference = Math.max(targetValue, 1); // Prevent division by zero
                  score = Math.max(0, 1 - (difference / maxDifference));
                }
              }
              break;
            case 'select':
              score = elementEntry.userInput === element.target ? 1 : 0;
              break;
          }
          totalScore += score * importance;
        }
        // If no entry found, score is implicitly 0
      }
    });
  });

  if (totalWeight === 0) {
    return 0; // Return 0 if there are no habits to avoid division by zero
  }

  const overallScore = (totalScore / totalWeight) * 100;
  return Math.round(overallScore);
}

export default calculateDailyRating;

