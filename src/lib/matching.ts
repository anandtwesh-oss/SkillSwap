import { User, UserSkill, BilateralMatch, SkillProficiency } from './types';

const proficiencyWeights: Record<SkillProficiency, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

/**
 * Calculates bilateral 2-way skill matches between an active user and all candidate users.
 */
export function findBilateralMatches(activeUser: User, allUsers: User[]): BilateralMatch[] {
  const matches: BilateralMatch[] = [];

  const activeTeachSkills = activeUser.skills.filter(s => s.type === 'TEACH');
  const activeLearnSkills = activeUser.skills.filter(s => s.type === 'LEARN');

  for (const candidate of allUsers) {
    if (candidate.id === activeUser.id) continue;

    const candidateTeachSkills = candidate.skills.filter(s => s.type === 'TEACH');
    const candidateLearnSkills = candidate.skills.filter(s => s.type === 'LEARN');

    // 1. What candidate teaches that active user wants to learn
    const offersYouTeach: UserSkill[] = [];
    for (const cTeach of candidateTeachSkills) {
      const isWanted = activeLearnSkills.some(
        aLearn => aLearn.name.toLowerCase() === cTeach.name.toLowerCase() ||
                 (aLearn.category === cTeach.category && aLearn.name.toLowerCase().includes(cTeach.name.toLowerCase()))
      );
      if (isWanted) {
        offersYouTeach.push(cTeach);
      }
    }

    // 2. What active user teaches that candidate wants to learn
    const wantsYouTeach: UserSkill[] = [];
    for (const cLearn of candidateLearnSkills) {
      const isOffered = activeTeachSkills.some(
        aTeach => aTeach.name.toLowerCase() === cLearn.name.toLowerCase() ||
                 (aTeach.category === cLearn.category && aTeach.name.toLowerCase().includes(cLearn.name.toLowerCase()))
      );
      if (isOffered) {
        wantsYouTeach.push(cLearn);
      }
    }

    const isExactBilateral = offersYouTeach.length > 0 && wantsYouTeach.length > 0;
    const matchReasons: string[] = [];
    const otherSynergies: string[] = [];

    let matchScore = 0;

    if (isExactBilateral) {
      matchScore = 80; // Base score for 2-way bilateral trade

      // Calculate primary pair
      const matchedOffer = offersYouTeach[0];
      const matchedWant = wantsYouTeach[0];

      matchReasons.push(
        `Direct 2-Way Swap: ${candidate.name} teaches ${matchedOffer.name} (${matchedOffer.proficiency}) in exchange for learning your ${matchedWant.name}.`
      );

      // Proficiency bonus: reward higher tutor proficiency
      const offerProf = proficiencyWeights[matchedOffer.proficiency] || 2;
      if (offerProf >= 3) {
        matchScore += 8;
        matchReasons.push(`High tutor expertise in ${matchedOffer.name} (${matchedOffer.proficiency}).`);
      }

      // Candidate reputation bonus
      if (candidate.rating >= 4.8 && candidate.reviewCount >= 5) {
        matchScore += 7;
        matchReasons.push(`Top-rated peer (${candidate.rating}★ with ${candidate.reviewCount} reviews).`);
      }

      // Extra multi-skill synergy
      if (offersYouTeach.length > 1 || wantsYouTeach.length > 1) {
        matchScore += 5;
        otherSynergies.push(`Multiple matching skills: ${offersYouTeach.map(s => s.name).join(', ')}`);
      }

      matchScore = Math.min(100, matchScore);
    } else if (offersYouTeach.length > 0) {
      // 1-way: They teach what you want
      matchScore = 55;
      matchReasons.push(`${candidate.name} teaches ${offersYouTeach.map(s => s.name).join(', ')} which is on your wishlist.`);
      if (candidate.rating >= 4.8) matchScore += 5;
    } else if (wantsYouTeach.length > 0) {
      // 1-way: You teach what they want
      matchScore = 50;
      matchReasons.push(`${candidate.name} wants to learn ${wantsYouTeach.map(s => s.name).join(', ')} which you offer.`);
    } else {
      // General category synergy
      const sharedCategories = activeTeachSkills.filter(a =>
        candidateTeachSkills.some(c => c.category === a.category)
      );
      if (sharedCategories.length > 0) {
        matchScore = 35;
        otherSynergies.push(`Shared domain interest: ${sharedCategories[0].category}`);
      }
    }

    if (matchScore >= 35) {
      matches.push({
        user: candidate,
        matchScore,
        isExactBilateral,
        offersYouTeach,
        wantsYouTeach,
        otherSynergies,
        matchReasons
      });
    }
  }

  // Sort highest match scores first, with exact bilateral matches at the top
  return matches.sort((a, b) => {
    if (a.isExactBilateral && !b.isExactBilateral) return -1;
    if (!a.isExactBilateral && b.isExactBilateral) return 1;
    return b.matchScore - a.matchScore;
  });
}
