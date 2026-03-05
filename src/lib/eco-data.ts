// Environmental impact calculation utilities and mock data

export interface DailyActivity {
  date: string;
  water: { liters: number; showers: number; dishwashing: number };
  electricity: { acHours: number; lightsHours: number; deviceCharging: number };
  transport: { carKm: number; busKm: number; walkKm: number; bicycleKm: number; trainKm: number };
  food: { vegetarian: number; vegan: number; meat: number };
  waste: { recycledKg: number; plasticItems: number; compostKg: number };
}

export interface ImpactScore {
  carbon: number; // kg CO2
  water: number; // liters
  energy: number; // kWh
  ecoScore: number; // 0-100
}

export const SUSTAINABLE_LIMITS = {
  water: 135, // liters per day
  carbon: 6.5, // kg CO2 per day (global avg ~16kg, sustainable ~6.5)
  energy: 8, // kWh per day
};

export function calculateImpact(activity: DailyActivity): ImpactScore {
  const waterTotal = activity.water.liters + activity.water.showers * 65 + activity.water.dishwashing * 15;
  const carbonFromCar = activity.transport.carKm * 0.21;
  const carbonFromBus = activity.transport.busKm * 0.089;
  const carbonFromTrain = activity.transport.trainKm * 0.041;
  const carbonFromFood = activity.food.meat * 3.3 + activity.food.vegetarian * 1.7 + activity.food.vegan * 0.9;
  const carbonFromEnergy = (activity.electricity.acHours * 1.5 + activity.electricity.lightsHours * 0.1 + activity.electricity.deviceCharging * 0.05) * 0.5;
  const carbonTotal = carbonFromCar + carbonFromBus + carbonFromTrain + carbonFromFood + carbonFromEnergy;
  const energyTotal = activity.electricity.acHours * 1.5 + activity.electricity.lightsHours * 0.1 + activity.electricity.deviceCharging * 0.05;

  // Eco score: 100 = perfect, penalize for exceeding limits
  let score = 100;
  if (waterTotal > SUSTAINABLE_LIMITS.water) score -= Math.min(30, ((waterTotal - SUSTAINABLE_LIMITS.water) / SUSTAINABLE_LIMITS.water) * 30);
  if (carbonTotal > SUSTAINABLE_LIMITS.carbon) score -= Math.min(40, ((carbonTotal - SUSTAINABLE_LIMITS.carbon) / SUSTAINABLE_LIMITS.carbon) * 40);
  if (energyTotal > SUSTAINABLE_LIMITS.energy) score -= Math.min(20, ((energyTotal - SUSTAINABLE_LIMITS.energy) / SUSTAINABLE_LIMITS.energy) * 20);
  // Bonus for good habits
  score += Math.min(5, activity.waste.recycledKg * 2);
  score += Math.min(5, activity.waste.compostKg * 3);
  score += Math.min(5, (activity.transport.walkKm + activity.transport.bicycleKm) * 0.5);

  return {
    carbon: Math.round(carbonTotal * 10) / 10,
    water: Math.round(waterTotal),
    energy: Math.round(energyTotal * 10) / 10,
    ecoScore: Math.max(0, Math.min(100, Math.round(score))),
  };
}

export function getSuggestions(impact: ImpactScore, activity: DailyActivity): string[] {
  const suggestions: string[] = [];
  const waterTotal = activity.water.liters + activity.water.showers * 65 + activity.water.dishwashing * 15;
  if (waterTotal > SUSTAINABLE_LIMITS.water) {
    suggestions.push(`You used ${waterTotal}L of water today. The sustainable limit is ${SUSTAINABLE_LIMITS.water}L. Try shorter showers!`);
  }
  if (impact.carbon > SUSTAINABLE_LIMITS.carbon) {
    suggestions.push(`Your carbon footprint is ${impact.carbon}kg CO₂. Consider walking or cycling instead of driving.`);
  }
  if (activity.electricity.acHours > 4) {
    suggestions.push("Try reducing AC usage. Each hour saved prevents ~0.75kg of CO₂ emissions.");
  }
  if (activity.food.meat > 1) {
    suggestions.push("Replacing one meat meal with a plant-based option saves ~2.4kg of CO₂.");
  }
  if (activity.waste.plasticItems > 3) {
    suggestions.push("Reduce single-use plastics. Bring reusable bags and bottles!");
  }
  if (suggestions.length === 0) {
    suggestions.push("Great job! You're living sustainably today. Keep it up! 🌱");
  }
  return suggestions;
}

export const ECO_TIPS = [
  "Air drying clothes saves up to 2kg of carbon emissions per load.",
  "A 5-minute shower uses about 40 liters less water than a 10-minute one.",
  "Eating one plant-based meal a day can reduce your carbon footprint by 1.5 tonnes per year.",
  "Turning off lights when leaving a room saves up to 10% on electricity bills.",
  "Walking or cycling for trips under 3km eliminates transport emissions entirely.",
  "Composting food waste reduces methane emissions from landfills by up to 50%.",
  "Using a reusable water bottle prevents ~167 plastic bottles from entering oceans yearly.",
  "Unplugging electronics when not in use prevents 'phantom' energy consumption.",
  "Planting one tree absorbs approximately 22kg of CO₂ per year.",
  "Buying local produce reduces food transportation emissions by up to 7%.",
];

export const ACHIEVEMENTS = [
  { id: "water-saver", name: "Water Saver", icon: "💧", description: "Used less than 100L water in a day", condition: (i: ImpactScore) => i.water < 100 },
  { id: "low-carbon", name: "Low Carbon Commuter", icon: "🚶", description: "Carbon footprint under 4kg in a day", condition: (i: ImpactScore) => i.carbon < 4 },
  { id: "recycler", name: "Recycling Champion", icon: "♻️", description: "Recycled more than 2kg in a day", condition: (_: ImpactScore, a: DailyActivity) => a.waste.recycledKg > 2 },
  { id: "green-eater", name: "Plant Powered", icon: "🥗", description: "Had only plant-based meals", condition: (_: ImpactScore, a: DailyActivity) => a.food.meat === 0 },
  { id: "eco-warrior", name: "Eco Warrior", icon: "🌍", description: "Achieved eco score above 90", condition: (i: ImpactScore) => i.ecoScore > 90 },
];

export function getDefaultActivity(): DailyActivity {
  return {
    date: new Date().toISOString().split("T")[0],
    water: { liters: 0, showers: 0, dishwashing: 0 },
    electricity: { acHours: 0, lightsHours: 0, deviceCharging: 0 },
    transport: { carKm: 0, busKm: 0, walkKm: 0, bicycleKm: 0, trainKm: 0 },
    food: { vegetarian: 0, vegan: 0, meat: 0 },
    waste: { recycledKg: 0, plasticItems: 0, compostKg: 0 },
  };
}

// Build weekly data from real logged activities
export function getRealWeeklyData(activities: DailyActivity[]): { day: string; carbon: number; water: number; energy: number; score: number }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const result: { day: string; carbon: number; water: number; energy: number; score: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const act = activities.find((a) => a.date === dateStr);
    if (act) {
      const impact = calculateImpact(act);
      result.push({ day: days[d.getDay()], carbon: impact.carbon, water: impact.water, energy: impact.energy, score: impact.ecoScore });
    } else {
      result.push({ day: days[d.getDay()], carbon: 0, water: 0, energy: 0, score: 0 });
    }
  }
  return result;
}

// Build stats data from real activities for given period
export function getRealStatsData(activities: DailyActivity[], period: string): { name: string; carbon: number; water: number; energy: number }[] {
  if (activities.length === 0) return [];

  const today = new Date();

  if (period === "daily") {
    // Show hourly breakdown - but we only have daily totals, so show today's single entry
    const todayStr = today.toISOString().split("T")[0];
    const act = activities.find((a) => a.date === todayStr);
    if (!act) return [];
    const impact = calculateImpact(act);
    return [{ name: "Today", carbon: impact.carbon, water: impact.water, energy: impact.energy }];
  }

  if (period === "weekly") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: { name: string; carbon: number; water: number; energy: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const act = activities.find((a) => a.date === dateStr);
      if (act) {
        const impact = calculateImpact(act);
        result.push({ name: days[d.getDay()], carbon: impact.carbon, water: impact.water, energy: impact.energy });
      } else {
        result.push({ name: days[d.getDay()], carbon: 0, water: 0, energy: 0 });
      }
    }
    return result;
  }

  if (period === "monthly") {
    const result: { name: string; carbon: number; water: number; energy: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      let totalCarbon = 0, totalWater = 0, totalEnergy = 0, count = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - w * 7 - d);
        const dateStr = date.toISOString().split("T")[0];
        const act = activities.find((a) => a.date === dateStr);
        if (act) {
          const impact = calculateImpact(act);
          totalCarbon += impact.carbon;
          totalWater += impact.water;
          totalEnergy += impact.energy;
          count++;
        }
      }
      result.push({ name: `W${4 - w}`, carbon: +(totalCarbon / Math.max(1, count)).toFixed(1), water: Math.round(totalWater / Math.max(1, count)), energy: +(totalEnergy / Math.max(1, count)).toFixed(1) });
    }
    return result;
  }

  // yearly - last 12 months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result: { name: string; carbon: number; water: number; energy: number }[] = [];
  for (let m = 11; m >= 0; m--) {
    const d = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const monthActivities = activities.filter((a) => a.date.startsWith(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`));
    if (monthActivities.length > 0) {
      const avg = monthActivities.reduce((acc, act) => {
        const impact = calculateImpact(act);
        return { carbon: acc.carbon + impact.carbon, water: acc.water + impact.water, energy: acc.energy + impact.energy };
      }, { carbon: 0, water: 0, energy: 0 });
      result.push({ name: months[d.getMonth()], carbon: +(avg.carbon / monthActivities.length).toFixed(1), water: Math.round(avg.water / monthActivities.length), energy: +(avg.energy / monthActivities.length).toFixed(1) });
    } else {
      result.push({ name: months[d.getMonth()], carbon: 0, water: 0, energy: 0 });
    }
  }
  return result;
}
