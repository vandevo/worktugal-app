export interface QuizQuestion {
  id: string;
  text: string;
  description?: string;
  type: 'multiple-choice' | 'yes-no' | 'select';
  options?: { value: string; label: string }[];
  weight: number;
  skipConditions?: (answers: Record<string, any>) => boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'visa_status',
    text: 'What is your current visa/residency status in Portugal?',
    description: 'Your legal right to stay in Portugal',
    type: 'select',
    options: [
      { value: 'eu_citizen', label: 'EU Citizen (no visa needed)' },
      { value: 'd1_visa', label: 'D1 Work Visa' },
      { value: 'd7_visa', label: 'D7 Visa & Temporary Residence (passive income)' },
      { value: 'd2_visa', label: 'D2 Visa (entrepreneur/self-employed)' },
      { value: 'd8_visa', label: 'D8 Visa (Digital Nomad)' },
      { value: 'golden_visa', label: 'Golden Visa' },
      { value: 'family_reunion', label: 'Family Reunion Visa' },
      { value: 'hqa_tech', label: 'Highly Qualified Professional (HQA) / Tech Visa' },
      { value: 'temp_residence', label: 'Temporary Residency (e.g. CPLP, reunification, HQA)' },
      { value: 'temporary_protection', label: 'Temporary Protection (for refugees)' },
      { value: 'permanent', label: 'Permanent Residence or Long-Term Status' },
      { value: 'eu_family_member', label: 'Non-EU family member of Portuguese or EU citizen' },
      { value: 'tourist', label: 'Tourist Visa / Visa-free stay' },
      { value: 'none', label: 'No visa/permit (overstayed)' }
    ],
    weight: 20
  },
  {
    id: 'tax_residence',
    text: 'Have you registered as a tax resident in Portugal?',
    description: 'Tax residency is usually automatic after 183 days in Portugal',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: "I'm not sure how to check this" }
    ],
    weight: 15
  },
  {
    id: 'nif',
    text: 'Do you have a Portuguese tax number (NIF)?',
    description: 'Required for most financial activities in Portugal',
    type: 'yes-no',
    weight: 10
  },
  {
    id: 'business_structure',
    text: 'What is your current business/employment structure?',
    type: 'select',
    options: [
      { value: 'employed_pt', label: 'Employed by Portuguese company' },
      { value: 'employed_foreign', label: 'Employed by foreign company' },
      { value: 'freelancer_remote', label: 'Working as a freelancer remotely' },
      { value: 'foreign_company', label: 'Running my own foreign company' },
      { value: 'freelancer', label: 'Trabalhador Independente (freelancer who issues Recibos Verdes)' },
      { value: 'unipessoal', label: 'Portuguese company (Unipessoal Lda)' },
      { value: 'passive_income', label: 'Passive income (investments, pensions, etc.)' },
      { value: 'none', label: 'No formal structure yet' }
    ],
    weight: 15
  },
  {
    id: 'social_security',
    text: 'Are you registered with Portuguese Social Security (NISS)?',
    description: 'Required for legal work and contributions in Portugal',
    type: 'yes-no',
    weight: 10
  },
  {
    id: 'banking',
    text: 'Do you have a Portuguese bank account?',
    type: 'yes-no',
    weight: 5
  },
  {
    id: 'time_in_portugal',
    text: 'How much time do you intend to spend in Portugal each year?',
    description: 'Important for determining tax residency obligations',
    type: 'select',
    options: [
      { value: 'less_than_90', label: 'Less than 90 days' },
      { value: '90_to_183', label: '90 to 183 days (up to 6 months)' },
      { value: 'more_than_183', label: 'More than 183 days (over 6 months)' },
      { value: 'full_time', label: 'Full-time resident' }
    ],
    weight: 10
  },
  {
    id: 'aima_appointment',
    text: 'Have you scheduled your AIMA appointment yet?',
    description: 'AIMA (Agência para a Integração, Migrações e Asilo, Portugal\'s immigration authority)',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure what this is' }
    ],
    weight: 10,
    skipConditions: (answers) => {
      const visaStatus = answers.visa_status;
      return ['eu_citizen', 'golden_visa', 'permanent', 'eu_family_member'].includes(visaStatus);
    }
  },
  {
    id: 'time_lived_in_portugal',
    text: 'How long have you been living in Portugal?',
    description: 'Important for tax residency and immigration status',
    type: 'select',
    options: [
      { value: 'less_than_90', label: 'Less than 90 days' },
      { value: '90_to_183', label: '90 to 183 days (up to 6 months)' },
      { value: 'more_than_183', label: 'More than 183 days (over 6 months)' },
      { value: 'not_yet', label: "I don't live there yet" }
    ],
    weight: 5
  },
  {
    id: 'health_insurance',
    text: 'Do you have valid health insurance covering €30,000+ in medical costs?',
    description: 'Required for Schengen area compliance and visa applications',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes (meets Schengen requirements)' },
      { value: 'no', label: 'No (high rejection risk)' }
    ],
    weight: 15,
    skipConditions: (answers) => {
      const visaStatus = answers.visa_status;
      return ['eu_citizen', 'golden_visa', 'permanent', 'eu_family_member'].includes(visaStatus);
    }
  },
  {
    id: 'monthly_income',
    text: 'What is your average monthly income?',
    description: 'Important for visa requirements and tax obligations. Portugal\'s legal minimum wage is €870/month (mainland), paid over 14 months.',
    type: 'select',
    options: [
      { value: 'below_870', label: 'Below €870' },
      { value: '870_to_3479', label: '€870 to €3,479' },
      { value: '3480_plus', label: '€3,480 or more' }
    ],
    weight: 10
  },
  {
    id: 'overstay_risk',
    text: 'Have you stayed in Portugal over 90 days without a valid visa or residence permit?',
    description: 'Overstaying can result in fines, deportation, and future visa bans',
    type: 'select',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
      { value: 'not_sure', label: 'Not sure' }
    ],
    weight: 20
  }
];

export const calculateScore = (answers: Record<string, any>): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  quizQuestions.forEach(question => {
    // Check if question should be skipped based on user's answers
    const shouldSkip = question.skipConditions && question.skipConditions(answers);
    
    if (!shouldSkip) {
      maxPossibleScore += question.weight;
      
      if (question.id in answers) {
        const answer = answers[question.id];
        
        // Calculate score based on question type and specific logic
        if (question.type === 'yes-no' && answer === 'yes') {
          totalScore += question.weight;
        } else if (question.id === 'visa_status') {
          if (['eu_citizen', 'd1_visa', 'd7_visa', 'd2_visa', 'd8_visa', 'golden_visa', 'family_reunion', 'hqa_tech', 'temp_residence', 'temporary_protection', 'permanent', 'eu_family_member'].includes(answer)) {
            totalScore += question.weight;
          } else if (answer === 'tourist') {
            totalScore += question.weight * 0.3;
          }
          // 'none' gets 0 points
        } else if (question.id === 'business_structure') {
          if (['employed_pt', 'freelancer', 'unipessoal'].includes(answer)) {
            totalScore += question.weight;
          } else if (['employed_foreign', 'foreign_company', 'freelancer_remote'].includes(answer)) {
            totalScore += question.weight * 0.5;
          } else if (answer === 'passive_income') {
            // Only give points for passive income if user has D7 visa
            if (answers.visa_status === 'd7_visa') {
              totalScore += question.weight;
            }
            // Otherwise 0 points
          }
        } else if (question.id === 'time_in_portugal') {
          if (answer === 'full_time') {
            totalScore += question.weight;
          } else if (answer === 'more_than_183') {
            totalScore += question.weight * 0.8;
          } else if (answer === '90_to_183') {
            totalScore += question.weight * 0.4;
          }
        } else if (question.id === 'tax_residence') {
          if (answer === 'yes') {
            totalScore += question.weight;
          } else if (answer === 'unsure') {
            totalScore += question.weight * 0.3;
          }
        } else if (question.id === 'aima_appointment') {
          if (answer === 'yes') {
            totalScore += question.weight;
          } else if (answer === 'unsure') {
            totalScore += question.weight * 0.3;
          }
        } else if (question.id === 'health_insurance') {
          if (answer === 'yes') {
            totalScore += question.weight;
          }
          // 'no' gets 0 points
        } else if (question.id === 'monthly_income') {
          if (answer === '3480_plus') {
            totalScore += question.weight;
          } else if (answer === '870_to_3479') {
            totalScore += question.weight * 0.8;
          } else if (answer === 'below_870') {
            totalScore += question.weight * 0.5;
          }
        } else if (question.id === 'overstay_risk') {
          if (answer === 'no') {
            totalScore += question.weight;
          } else if (answer === 'not_sure') {
            totalScore += question.weight * 0.3;
          }
          // 'yes' gets 0 points
        }
      }
    }
  });
  
  return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
};

export const getRecommendations = (answers: Record<string, any>): string[] => {
  const recommendations: string[] = [];
  
  // Visa recommendations
  if (!answers.visa_status || answers.visa_status === 'tourist' || answers.visa_status === 'none') {
    recommendations.push('Apply for an appropriate residency visa based on your situation (D1, D7, D2, or Digital Nomad)');
  }
  
  // EU family member specific recommendation
  if (answers.visa_status === 'eu_family_member') {
    recommendations.push('Apply for a residence card through AIMA as a family member of an EU citizen under EU law');
  }
  
  // Tax registration
  if (answers.tax_residence === 'no' || answers.tax_residence === 'unsure') {
    if (answers.time_in_portugal === 'more_than_183' || answers.time_in_portugal === 'full_time') {
      recommendations.push('Register as a tax resident with the Portuguese tax authorities');
    }
  }
  
  // NIF
  if (answers.nif === 'no') {
    recommendations.push('Obtain a Portuguese tax number (NIF) as soon as possible');
  }
  
  // Business structure
  if (answers.business_structure === 'none' || answers.business_structure === 'foreign_company') {
    recommendations.push('Establish a proper business structure in Portugal (Recibos Verdes or Unipessoal Lda)');
  }
  
  // Social security
  if (answers.social_security === 'no' && answers.business_structure !== 'employed_foreign') {
    recommendations.push('Register with Portuguese Social Security (NISS)');
  }
  
  // Banking
  if (answers.banking === 'no') {
    recommendations.push('Open a Portuguese bank account to facilitate local transactions and tax payments');
  }
  
  // AIMA appointment (only if not skipped)
  const aimaQuestion = quizQuestions.find(q => q.id === 'aima_appointment');
  const shouldSkipAima = aimaQuestion?.skipConditions && aimaQuestion.skipConditions(answers);
  
  if (!shouldSkipAima && (answers.aima_appointment === 'no' || answers.aima_appointment === 'unsure')) {
    recommendations.push('Schedule your AIMA appointment to formalize your residency status');
  }
  
  // Health insurance (only if not skipped)
  const healthQuestion = quizQuestions.find(q => q.id === 'health_insurance');
  const shouldSkipHealth = healthQuestion?.skipConditions && healthQuestion.skipConditions(answers);
  
  if (!shouldSkipHealth && answers.health_insurance === 'no') {
    recommendations.push('Obtain health insurance covering at least €30,000 in medical costs');
  }
  
  // Income requirements
  if (answers.monthly_income === 'below_870') {
    recommendations.push('Ensure your income meets minimum requirements for your visa type (typically €870+ for D7/D8)');
  }
  
  // Overstay risk
  if (answers.overstay_risk === 'yes' || answers.overstay_risk === 'not_sure') {
    recommendations.push('Address any potential overstay issues immediately to avoid legal complications');
  }
  
  return recommendations;
};

export const getRiskMessage = (score: number): string => {
  if (score <= 40) {
    return "High Risk — You're missing key steps to be legally compliant.";
  } else if (score <= 70) {
    return "Partial Setup — You've started, but still have major gaps.";
  } else {
    return "Almost There — You're mostly compliant, but still have a few things to fix.";
  }
};

// New function to check for red flag warnings
export const getRedFlagWarnings = (answers: Record<string, any>): string[] => {
  const warnings: string[] = [];
  
  // Red Flag 1: Overstaying or missing registrations
  const isOverstayingRisk = (
    (['tourist', 'none'].includes(answers.visa_status)) &&
    (['90_to_183', 'more_than_183', 'full_time'].includes(answers.time_in_portugal)) &&
    (answers.nif === 'no') &&
    (['no', 'unsure'].includes(answers.aima_appointment))
  );
  
  if (isOverstayingRisk) {
    warnings.push('You may be overstaying or missing required registrations. This can lead to fines or future entry bans. Book a clarity call to fix this fast.');
  }
  
  // Red Flag 2: VAT registration requirement
  const needsVATRegistration = (
    (['freelancer', 'unipessoal'].includes(answers.business_structure)) &&
    (['3480_plus', '870_to_3479'].includes(answers.monthly_income))
  );
  
  if (needsVATRegistration) {
    warnings.push('You may need to register for IVA (VAT) if your income exceeds €13,500 per year. Many freelancers miss this and face backdated penalties.');
  }
  
  return warnings;
};

// New function to check if user should see first 30 days checklist
export const shouldShowFirst30Days = (answers: Record<string, any>): boolean => {
  return answers.time_lived_in_portugal === 'less_than_90';
};

export const getScoreExplanation = (answers: Record<string, any>): string[] => {
  const explanations: string[] = [];
  
  // Check for skipped questions and explain why
  const skippedQuestions: string[] = [];
  
  quizQuestions.forEach(question => {
    if (question.skipConditions && question.skipConditions(answers)) {
      if (question.id === 'health_insurance') {
        if (answers.visa_status === 'eu_family_member') {
          skippedQuestions.push('Health insurance requirement was not shown because EU family members are exempt');
        } else {
          skippedQuestions.push('Health insurance requirement was not shown because EU citizens and Golden Visa holders are exempt');
        }
      } else if (question.id === 'aima_appointment') {
        if (answers.visa_status === 'eu_family_member') {
          skippedQuestions.push('AIMA appointment was not shown because EU family members apply for residence cards directly');
        } else {
          skippedQuestions.push('AIMA appointment was not shown because it does not apply to your visa status');
        }
      }
    }
  });
  
  // Add skipped question explanations
  skippedQuestions.forEach(explanation => {
    explanations.push(explanation);
  });
  
  // Add penalty explanations
  if (answers.nif === 'no') {
    explanations.push('Missing NIF reduces your score significantly');
  }
  
  if (answers.social_security === 'no' && answers.business_structure === 'freelancer') {
    explanations.push('Freelancers without NISS registration face legal risks');
  }
  
  if (answers.health_insurance === 'no') {
    const healthQuestion = quizQuestions.find(q => q.id === 'health_insurance');
    const shouldSkipHealth = healthQuestion?.skipConditions && healthQuestion.skipConditions(answers);
    
    if (!shouldSkipHealth) {
      explanations.push('No health insurance creates visa and emergency risks');
    }
  }
  
  if (answers.overstay_risk === 'yes') {
    explanations.push('Overstaying without permits creates serious legal issues');
  }
  
  if (answers.aima_appointment === 'no') {
    const aimaQuestion = quizQuestions.find(q => q.id === 'aima_appointment');
    const shouldSkipAima = aimaQuestion?.skipConditions && aimaQuestion.skipConditions(answers);
    
    if (!shouldSkipAima) {
      explanations.push('Missing AIMA appointment delays legal status');
    }
  }
  
  if (answers.monthly_income === 'below_870') {
    explanations.push('Income below visa thresholds affects eligibility');
  }
  
  if (answers.business_structure === 'passive_income' && answers.visa_status !== 'd7_visa') {
    explanations.push('Passive income structure only applies to D7 visa holders');
  }
  
  // EU family member specific explanation
  if (answers.visa_status === 'eu_family_member') {
    explanations.push('As an EU family member, you have special rights under EU law and can apply for a residence card directly');
  }
  
  return explanations;
};

export const getSkippedQuestions = (answers: Record<string, any>): QuizQuestion[] => {
  return quizQuestions.filter(question => 
    question.skipConditions && question.skipConditions(answers)
  );
};