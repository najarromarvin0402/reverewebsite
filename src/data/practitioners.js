import { fetchPractitionersFromDb, savePractitionersToDb } from '../lib/supabase';

// Generated Practitioner Profiles from Revere Wellness JaneApp
// Direct JaneApp Booking Base: https://reverewellness.janeapp.com/

export const DEFAULT_PRACTITIONERS = [
  {
    "id": 87,
    "slug": "joshua-chan",
    "name": "Joshua Chan",
    "professionalName": "Joshua Chan, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjUtMTItMDkvMDUyMzAwLzlmNTVlMWVhLWMwNmYtNDlkOC1hY2QwLWVmYWU0Y2E3ZjY5Yi9Kb3NoLVBpY3R1cmUuanBnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=7ab17390a47058aa&for=reverewellness.janeapp.com",
    "shortBio": "Passionate about health, recovery, and performance. Joshua utilizes tailored deep tissue, active release, and evidence-based rehabilitation to return clients to their peak vitality.",
    "bio": "Josh is passionate about health, recovery, and performance. He believes that staying active and living a healthy lifestyle is one of the most effective ways to take care of both your body and mind. Whether he is working out, staying fit, or exploring new ways to challenge himself physically, movement has always been a central part of his life.\n\nThrough massage therapy, Josh aims to help people get back to doing the things they love—whether that’s returning to sports, recovering from injury, or simply moving through life pain-free. He understands the physical and mental demands that come with an active lifestyle, and he is dedicated to helping clients restore mobility, reduce discomfort, and improve overall physical function.\n\nJosh takes a patient-centered approach to care, listening closely to each individual’s goals and creating personalized treatment plans that support long-term recovery and well-being. He is committed to empowering clients through education, hands-on treatment, and active rehabilitation strategies that promote sustainable health and performance.\n\nJosh also has a deep interest in sports, which fuels his understanding of athletic performance and injury recovery. When he’s not working, you can often find him staying active, watching games, or enjoying downtime with family and friends.",
    "specialties": [
      "Deep Tissue Massage",
      "Sports Injury Recovery",
      "Myofascial Release",
      "Trigger Point Therapy",
      "ICBC Motor Vehicle Rehab",
      "Postural Restoration"
    ],
    "education": "Langara College Registered Massage Therapy Program",
    "languages": [
      "English"
    ],
    "yearsExperience": "5+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      2,
      24,
      76,
      77
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/87",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 76,
        "name": "ICBC RMT Massage - Initial Session 45 mins",
        "duration": 55,
        "price": 131.25,
        "description": "  \r\n\r\n1.  Pls provide your ICBC claim no., date of accident and name / contact no of ICBC adjuster\r\n\r\n2.  Available only with Mandish Sehra.and Johan Colinco Prabh Grewal\r\n\r\n",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 82,
    "slug": "cher-sayuno",
    "name": "Cher Sayuno",
    "professionalName": "Cher Sayuno, PT",
    "title": "Registered Physiotherapist",
    "credentials": "B.Sc. PT, CHCPBC, CPTBC Registered",
    "disciplineCategory": "physio",
    "disciplineLabel": "Physiotherapy & Rehabilitation",
    "disciplines": [
      "Physiotherapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjUtMDUtMjAvMDM1NTAwLzM5OTYzNTgwLTgzMjktNGM1ZS1iOWZkLWMxNzFmNmM2Mzk4Yi9JTUdfNjUyMi5qcGVnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=d8aa63d3963a51f9&for=reverewellness.janeapp.com",
    "shortBio": "With over 25 years of international and BC clinical experience, Cher specializes in orthopedic rehabilitation, TMJ dysfunction, lumbar spine mechanical therapy, and ICBC recovery.",
    "bio": "Cher completed her Bachelor of Science in Physical Therapy in 1997. She graduated from De La Salle University in the Philippines. Currently serving in Public Health as a Home Health PT. Cher swims and travels to unwind and recharge her energy to be ready to get back in helping clients to recover from their injuries and medical conditions.\n\nMemberships & Affiliations:\n• College of Health and Care Professionals of BC (CHCPBC)\n• College of Physical Therapists of British Columbia (CPTBC)\n\nSpecial Interests & Clinical Background:\n• Orthopaedics with over 2.5 decades of clinical experience in managing complex musculoskeletal conditions locally.\n• Engaged in neurological rehabilitation internationally for 5 years prior to practicing in BC.\n• Held the position of Department Head and Clinical Instructor of the RTA Program in one of the private colleges in Surrey, BC for 13 years.\n• Participated in 2016–2017 as a PTA Educator / Peer Review Team member in OTA-PTA PEAC's accreditation process of private colleges in Ontario.\n\nAdvanced Post-Graduate Training:\n• Mulligan's Mobilization with Movement techniques\n• Kinesiotaping & athletic stabilization\n• Evidence-based assessment and management of TMJ (jaw) dysfunction\n• McKenzie Method of Mechanical Diagnosis and Therapy (MDT): Part A (Lumbar Spine) & Part C (Advanced Lumbar Spine and Lower Extremities)\n• AAAC (Association of Accrediting Agencies of Canada) Basic Evaluator Training Program",
    "specialties": [
      "Orthopedic Rehabilitation",
      "TMJ Dysfunction Assessment & Care",
      "McKenzie MDT Lumbar Spine",
      "Mulligan Mobilization",
      "Kinesiotaping",
      "ICBC Direct Billing Rehab",
      "Neurological Rehabilitation"
    ],
    "education": "B.Sc. Physical Therapy, De La Salle University (1997)",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "25+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      48,
      49,
      50,
      51,
      55,
      60,
      93,
      105,
      108
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/82",
    "treatments": [
      {
        "id": 48,
        "name": "Physiotherapy-Initial visit (60mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy-initial visit (60 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 49,
        "name": "Physiotherapy-Subsequent visit (60 mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy-Subsequent visit (60 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 50,
        "name": "Physiotherapy-initial visit (45 mins)",
        "duration": 45,
        "price": 128,
        "description": "Physiotherapy-initial visit (45 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 51,
        "name": "Physiotherapy- Subsequent visit (45 mins)",
        "duration": 45,
        "price": 128,
        "description": "Physiotherapy- Subsequent visit (45 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 55,
        "name": "Physiotherapy-Initial visit-ICBC",
        "duration": 45,
        "price": 154,
        "description": "Physiotherapy-Initial visit-ICBC (45 mins)\r\nZERO PAY for eligible clients",
        "priceIncludesTax": false
      },
      {
        "id": 60,
        "name": "Physiotherapy-Subsequent visit-ICBC",
        "duration": 35,
        "price": 97,
        "description": "Physiotherapy-Subsequent visit-ICBC (30mins)\r\n\r\nZERO PAY for eligible clients",
        "priceIncludesTax": false
      },
      {
        "id": 93,
        "name": "Physiotherapy-Initial visit (60mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy-initial visit (60 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 105,
        "name": "Physiotherapy subsequent visit ( 60 mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy- Subsequent visit (60 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 108,
        "name": "Physio N/C",
        "duration": 30,
        "price": 0,
        "description": "",
        "priceIncludesTax": false
      }
    ]
  },
  {
    "id": 71,
    "slug": "maria-jarkova",
    "name": "Maria Jarkova",
    "professionalName": "Maria Jarkova, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjUtMDItMDYvMjIxODA0LzRiMjA3MDgxLWNjODUtNDY5Yy05YTQxLTcxNmZkMTYzM2Q3OS9JTUdfNTQxMS5qcGVnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=0a68d47fda4e0792&for=reverewellness.janeapp.com",
    "shortBio": "Maria is passionate about holistic healthcare, combining therapeutic deep tissue, hot/cold stone therapy, and specialized pregnancy/postpartum support with yoga-informed movement.",
    "bio": "Maria is passionate about health-care. She believes that staying active, be it playing sports, practicing yoga or simply going for a daily walk, is essential for our physical, mental and emotional well-being. She has an active background, playing competitive volleyball in high school, dancing and now she enjoys practicing yoga and hiking with her dog.\n\nHer past sport-related injuries brought her to the healthcare field. Maria completed a Bachelor's Degree in Human Kinetics with a minor in Psychology at the University of British Columbia, Okanagan in 2017. Later on she decided to pursue a career in Registered Massage Therapy, graduating from Vancouver Career College in 2020. \n\nThrough these programs, she learned about the human body, its anatomy, biomechanics, mechanisms of injury, and how that impacts a person's mental and physical health. She incorporates this knowledge into her treatments to ensure the patients receive the best care for their specific needs. Maria is dedicated to helping her patients reach their health goals, whether it is decreasing stress, decreasing pain, or improving their functional mobility.\n\nMaria uses a variety of techniques in her treatments, including Swedish massage, myofascial release, joint mobilizations, trigger point release, and active/passive stretching. She is also certified in Hot and Cold Stone Therapy, which she incorporates into her treatments to help reduce muscle tension, improve circulation, and promote relaxation. She also has a special interest in Prenatal and Postpartum Massage Therapy, helping mothers navigate the physical changes and challenges of pregnancy and motherhood.\n\nIn her spare time, Maria enjoys practicing yoga, hiking, camping, and spending time with her dog, friends, and family.",
    "specialties": [
      "Hot & Cold Stone Therapy",
      "Prenatal & Postpartum Massage",
      "Myofascial Release",
      "Trigger Point Therapy",
      "Joint Mobilization",
      "Swedish Relaxation",
      "Sports Recovery"
    ],
    "education": "BHK Human Kinetics (UBC Okanagan, 2017) & Vancouver Career College RMT (2020)",
    "languages": [
      "English",
      "Russian"
    ],
    "yearsExperience": "6+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      57,
      102
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/71",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 57,
        "name": "RMT Massage  (30 minutes)",
        "duration": 30,
        "price": 87.5,
        "description": "This session is for 30 mins only.  You cannot combine two 30-minute sessions into a 60-minute sessions.  It will be billed as two separate 30-minute sessions",
        "priceIncludesTax": true
      },
      {
        "id": 102,
        "name": "Manual Lymphatic Massage (60 mins)",
        "duration": 65,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 64,
    "slug": "tejinder-jawanda",
    "name": "TJ (Tejinder Jawanda)",
    "professionalName": "Tejinder Jawanda, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered, M.Sc.",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjYtMDctMDMvMTkwNDU4LzQ2M2NkZjk4LWZlNzQtNDVjNy04MTE0LWFjYTI2ZmFmMDdiYi9ERkZFQ0I1NS03MkFDLTQ2N0MtQTc3RS1DQjQzOTREM0ExMjkucG5nIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=92810284c35bf0b1&for=reverewellness.janeapp.com",
    "shortBio": "Graduating with honours from CDI College with a Master's degree background, TJ provides empathetic, goal-driven therapy using active release, trigger point, and deep tissue techniques.",
    "bio": "Tejinder graduated with honours from the registered massage therapy program at CDI College South Surrey. Before studying to become an RMT, Tejinder completed his master’s degree in chemistry and he was a high school teacher for 5 years. He grew up playing a variety of sports.\n\nTejinder likes working with patients of all ages and helping them achieve their goals in terms of their health, whether patients want to decrease their pain from an injury or develop a pain-free and healthy body. Tejinder has a passion for helping people and gets satisfaction out of it, this was the main reason why he chose to become an RMT. \n\nTejinder uses a variety of techniques in his treatments such as trigger point release, myofascial release, active release techniques, Swedish massage techniques, joint mobilization, and deep tissue massage.\n\nIn his spare time, he likes to play soccer or cricket, spend time with his family, and watch his favourite television shows and sports. Tejinder can provide RMT services in English, Punjabi and Hindi.",
    "specialties": [
      "Deep Tissue Massage",
      "Active Release Techniques",
      "Myofascial Release",
      "Trigger Point Therapy",
      "Joint Mobilization",
      "ICBC Motor Vehicle Accident Care",
      "Sports Injury Recovery"
    ],
    "education": "Honours Graduate, CDI College South Surrey RMT Program; M.Sc.",
    "languages": [
      "English",
      "Punjabi",
      "Hindi"
    ],
    "yearsExperience": "5+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      76,
      77,
      62
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/64",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 76,
        "name": "ICBC RMT Massage - Initial Session 45 mins",
        "duration": 55,
        "price": 131.25,
        "description": "  \r\n\r\n1.  Pls provide your ICBC claim no., date of accident and name / contact no of ICBC adjuster\r\n\r\n2.  Available only with Mandish Sehra.and Johan Colinco Prabh Grewal\r\n\r\n",
        "priceIncludesTax": true
      },
      {
        "id": 62,
        "name": "RMT Massage with Hot  Stone (60 minutes)",
        "duration": 60,
        "price": 143.5,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 90,
    "slug": "katrina-mascardo",
    "name": "Katrina Mascardo",
    "professionalName": "Katrina Mascardo, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT (BC & ON), RPN (Ontario)",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjYtMDUtMTUvMTQxNTUzLzJhOTU4NmFmLTE0MDctNDFkNy04Y2YwLTRmNzU0ODZlZmMwNS9CaW8ucG5nIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=4d96efa6e27e1dcb&for=reverewellness.janeapp.com",
    "shortBio": "With a dual background as an RMT and Registered Practical Nurse, Katrina delivers attentive therapeutic deep tissue care customized to each client's healing and stress relief needs.",
    "bio": "Katrina is a Registered Massage Therapist who graduated from Wellspring College in Ontario in June 2015. She started her practice in Ontario from 2016 to 2020 and moved her practice to British Columbia in 2021.\n\nShe is also a Registered Practical Nurse in Ontario. As an RMT, her goal is to provide utmost care to her clients by understanding their needs and tailor-fitting her service based on those needs. \n\nShe specializes in therapeutic deep tissue massage but is always open to those who prefer a more relaxed approach to treatment. She is always receptive to clients' feedback during treatment which enables her to modify her pressure and technique as needed for optimal results.",
    "specialties": [
      "Therapeutic Deep Tissue",
      "Trigger Point Therapy",
      "Hot Stone Therapy",
      "Stress & Tension Relief",
      "Postural Realignment",
      "Clinical Nursing Insight"
    ],
    "education": "Wellspring College Ontario (Graduated 2015); Registered Practical Nurse (RPN)",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "11+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      62
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/90",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 62,
        "name": "RMT Massage with Hot  Stone (60 minutes)",
        "duration": 60,
        "price": 143.5,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 32,
    "slug": "ryan-sexcion",
    "name": "Ryan Sexcion",
    "professionalName": "Ryan Sexcion, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjItMTItMTQvMjIzMzIyLzRjMGVmZTdmLWRlNTktNDIzMi1hNTU1LTBmYzkwODg1YmI1OC9SeWFuLmpwZyJdLFsicCIsInRodW1iIiwiODAweDEwNDAjIl1d?sha=c430fcfb9822e705&for=reverewellness.janeapp.com",
    "shortBio": "Langara College graduate focusing on empathetic communication, customized myofascial work, trigger point release, and actionable homecare recommendations.",
    "bio": "Ryan completed his diploma in Registered Massage Therapy at Langara College. His approach to treatment depends on each individual he works with. He believes that communication between therapist and patient is essential when creating a treatment plan that works.\n\nYou can expect his sessions to include a variety of techniques such as Swedish massage, myofascial and trigger point release, passive and active stretching, as well as joint mobilizations. He also includes personalized homecare recommendations tailored to your individual goals and lifestyle to ensure lasting results between sessions.",
    "specialties": [
      "Swedish Massage",
      "Myofascial Release",
      "Trigger Point Therapy",
      "Joint Mobilizations",
      "Active Stretching & Homecare",
      "Prenatal / Postnatal Massage"
    ],
    "education": "Langara College Registered Massage Therapy Program",
    "languages": [
      "English"
    ],
    "yearsExperience": "6+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      19,
      92
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/32",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 19,
        "name": "RMT Massage (45 minutes)",
        "duration": 45,
        "price": 110,
        "description": "Therapeutic or relaxation massage provided by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 92,
        "name": "30 mins -RMT",
        "duration": 30,
        "price": 87.5,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 86,
    "slug": "prabhjot-gill",
    "name": "Prabhjot Gill",
    "professionalName": "Prabhjot Gill, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjYtMDctMjgvMjIzMDA4LzdhZjUwYTBhLTliYTItNDAyYi04ZmYyLWZiYjhhMzc5ZjZkNi9FRUQzM0Y4Ny1BRjMwLTRBQzMtOTY2RC02MUMxM0JBMkNENjUuanBlZyJdLFsicCIsInRodW1iIiwiODAweDEwNDAjIl1d?sha=a28dc5b9bde67fbe&for=reverewellness.janeapp.com",
    "shortBio": "Dedicated to excellence across all facets of practice, Prabhjot provides thorough assessment, targeted deep tissue relief, and supportive injury recovery.",
    "bio": "I am Prabhjot Gill, a Registered Massage Therapist. Dedicated to excellence in every facet of my practice, I provide comprehensive care focused on alleviating chronic pain, restoring proper biomechanics, and promoting overall wellness.\n\nMy treatments blend Swedish massage, deep tissue techniques, myofascial release, and passive stretching to address muscular imbalances, tension headaches, sports injuries, and postural strain. I believe in establishing a genuine collaborative relationship with each patient, listening carefully to their health history and crafting an individualized treatment plan that fosters long-term healing and physical resilience.",
    "specialties": [
      "Deep Tissue Massage",
      "Swedish Relaxation",
      "ICBC Direct Billing Care",
      "Trigger Point Release",
      "Prenatal Massage",
      "Neck & Shoulder Tension"
    ],
    "education": "Registered Massage Therapy Program Graduate",
    "languages": [
      "English",
      "Punjabi"
    ],
    "yearsExperience": "4+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      19,
      24,
      76,
      77
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/86",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 19,
        "name": "RMT Massage (45 minutes)",
        "duration": 45,
        "price": 110,
        "description": "Therapeutic or relaxation massage provided by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 76,
        "name": "ICBC RMT Massage - Initial Session 45 mins",
        "duration": 55,
        "price": 131.25,
        "description": "  \r\n\r\n1.  Pls provide your ICBC claim no., date of accident and name / contact no of ICBC adjuster\r\n\r\n2.  Available only with Mandish Sehra.and Johan Colinco Prabh Grewal\r\n\r\n",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 76,
    "slug": "anej-cleofe",
    "name": "Anej Cleofe",
    "professionalName": "Anej Cleofe, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjUtMDEtMjIvMDM1NjI0L2YyNjU3MzY5LTJkZmQtNDg2YS1iNWNkLTdlZTBkMWQzNTc0Yi9JTUdfMzA0MC5qcGVnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=ed189401f65e295c&for=reverewellness.janeapp.com",
    "shortBio": "Compassionate Pacific Coastal College graduate committed to empowering patients through targeted therapeutic massage, hot stone therapy, and mindful stress reduction.",
    "bio": "Anej attended her Registered Massage Therapy program at Pacific Coastal College of Massage Therapy. She is deeply compassionate and dedicated to helping each client achieve relief from muscular aches, postural strain, and day-to-day stress.\n\nAnej believes that therapeutic touch combined with a calm, attentive environment can make a profound difference in recovery. She adapts her treatment style to each patient's specific comfort level, blending Swedish relaxation techniques with deep tissue work, myofascial therapy, and hot stone applications for thorough rejuvenation.",
    "specialties": [
      "Therapeutic Relaxation",
      "Deep Tissue Work",
      "Hot Stone Therapy",
      "Prenatal / Postnatal Massage",
      "Stress & Tension Relief",
      "Postural Assessment"
    ],
    "education": "Pacific Coastal College of Massage Therapy",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "4+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      7,
      57,
      61
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/76",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 57,
        "name": "RMT Massage  (30 minutes)",
        "duration": 30,
        "price": 87.5,
        "description": "This session is for 30 mins only.  You cannot combine two 30-minute sessions into a 60-minute sessions.  It will be billed as two separate 30-minute sessions",
        "priceIncludesTax": true
      },
      {
        "id": 61,
        "name": "Non-RMT Massage (30 minutes)",
        "duration": 30,
        "price": 45,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 29,
    "slug": "jena-cleofe",
    "name": "Jena Cleofe",
    "professionalName": "Jena Cleofe, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjItMDgtMDIvMTkzMjMzLzYyZmU0MzEzLWQyNjgtNDkxOS04M2Q5LTQyZTQ2NjkwN2I0OC9KZW5hICgyKS5qcGciXSxbInAiLCJ0aHVtYiIsIjgwMHgxMDQwIyJdXQ?sha=c1541a69d70dc06a&for=reverewellness.janeapp.com",
    "shortBio": "Vancouver Career College & CTCMP graduate with a warm, client-focused approach specializing in hot stone massage, prenatal care, and deep relaxation.",
    "bio": "Jena attended her Registered Massage Therapy program at Vancouver Career College and CTCMP in Toronto. She is very customer-focused and helps clients unwind from the daily pressures of life while addressing chronic tension in the neck, shoulders, and lower back.\n\nJena is an attentive listener who takes the time to understand your physical comfort zones, tailoring her pressure to your exact preference. Whether you are dealing with desk-work stiffness, pregnancy discomfort, or recovering from a muscle strain, Jena delivers treatments designed to restore both physical ease and mental peace.",
    "specialties": [
      "Hot Stone Massage",
      "Prenatal & Postnatal Therapy",
      "Deep Tissue Tension Release",
      "Swedish Massage",
      "Neck & Shoulder Relief"
    ],
    "education": "Vancouver Career College & CTCMP Toronto",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "6+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      61,
      7,
      57,
      1,
      95
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/29",
    "treatments": [
      {
        "id": 61,
        "name": "Non-RMT Massage (30 minutes)",
        "duration": 30,
        "price": 45,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 57,
        "name": "RMT Massage  (30 minutes)",
        "duration": 30,
        "price": 87.5,
        "description": "This session is for 30 mins only.  You cannot combine two 30-minute sessions into a 60-minute sessions.  It will be billed as two separate 30-minute sessions",
        "priceIncludesTax": true
      },
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 30,
    "slug": "jenny-cleofe",
    "name": "Jenny Cleofe",
    "professionalName": "Jenny Cleofe, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjItMDgtMDIvMTkyODExLzcxNGM0ZTI4LWQ0MDItNDI5NC1hYTc3LWQyMjZlMGY3ZmI4ZC9KZW5ueS5qcGciXSxbInAiLCJ0aHVtYiIsIjgwMHgxMDQwIyJdXQ?sha=98f130de72d10745&for=reverewellness.janeapp.com",
    "shortBio": "Senior therapist with extensive training from Vancouver Career College and CTCMP Toronto, delivering highly effective therapeutic deep tissue and restorative hot stone care.",
    "bio": "Jenny studied the Registered Massage Therapy program at Vancouver Career College and graduated from the RMT program at CTCMP in Toronto. She brings extensive experience, fine-tuned palpation skills, and deep anatomical knowledge to every treatment.\n\nJenny understands that chronic stiffness and postural fatigue require both focused therapeutic release and mindful relaxation. She combines firm deep tissue pressure with gentle myofascial unwinding and soothing heat therapy to release stubborn trigger points, relieve nerve compression, and restore healthy range of motion.",
    "specialties": [
      "Therapeutic Deep Tissue",
      "Hot Stone Therapy",
      "Myofascial Trigger Point Care",
      "Prenatal & Postnatal Massage",
      "Chronic Lower Back & Sciatica Relief"
    ],
    "education": "Vancouver Career College & CTCMP Toronto RMT Program",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "7+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      7,
      57,
      61
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/30",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 57,
        "name": "RMT Massage  (30 minutes)",
        "duration": 30,
        "price": 87.5,
        "description": "This session is for 30 mins only.  You cannot combine two 30-minute sessions into a 60-minute sessions.  It will be billed as two separate 30-minute sessions",
        "priceIncludesTax": true
      },
      {
        "id": 61,
        "name": "Non-RMT Massage (30 minutes)",
        "duration": 30,
        "price": 45,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 54,
    "slug": "rora-cuevas",
    "name": "Rora Cuevas",
    "professionalName": "Rora Cuevas, PT",
    "title": "Registered Physiotherapist",
    "credentials": "PT, CHCPBC Registered",
    "disciplineCategory": "physio",
    "disciplineLabel": "Physiotherapy & Rehabilitation",
    "disciplines": [
      "Physiotherapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjUtMDItMDMvMDAzODUxLzUxYmQyNDljLWNkYmUtNDBmMS1iZDhhLWQ1ZTI3NGVlOWQ0Mi9Sb3JhJ3MgcGhvdG8uanBnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=5cd2ed999085ec3d&for=reverewellness.janeapp.com",
    "shortBio": "Dedicated Registered Physiotherapist offering thorough orthopedic assessments, joint mobilization, postural correction, and ICBC motor vehicle accident rehabilitation.",
    "bio": "Rora is a Registered Physiotherapist committed to helping patients overcome pain, regain functional independence, and prevent recurrent injuries. Her clinical practice centers on comprehensive assessment, manual therapy, and patient education.\n\nWhether you are recovering from a motor vehicle accident under ICBC, managing persistent spinal stiffness, or recovering from a sports injury, Rora works closely with you to establish achievable milestones and evidence-informed treatment pathways. Her warm, encouraging approach ensures patients feel supported at every step of their rehabilitation.",
    "specialties": [
      "Orthopedic Physiotherapy",
      "ICBC Motor Vehicle Accident Rehab",
      "Joint Mobilization & Manual Therapy",
      "Postural Restoration",
      "Exercise Prescription & Strengthening"
    ],
    "education": "Bachelor of Science in Physical Therapy",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "10+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      51,
      50,
      48,
      49
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/54",
    "treatments": [
      {
        "id": 51,
        "name": "Physiotherapy- Subsequent visit (45 mins)",
        "duration": 45,
        "price": 128,
        "description": "Physiotherapy- Subsequent visit (45 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 50,
        "name": "Physiotherapy-initial visit (45 mins)",
        "duration": 45,
        "price": 128,
        "description": "Physiotherapy-initial visit (45 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 48,
        "name": "Physiotherapy-Initial visit (60mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy-initial visit (60 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 49,
        "name": "Physiotherapy-Subsequent visit (60 mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy-Subsequent visit (60 mins)",
        "priceIncludesTax": false
      }
    ]
  },
  {
    "id": 52,
    "slug": "komalbir-kaur",
    "name": "Komalbir Kaur",
    "professionalName": "Komalbir Kaur, RMT",
    "title": "Registered Massage Therapist & MLD Specialist",
    "credentials": "RMT, CCHPBC Registered, MLD Certified",
    "disciplineCategory": "mld",
    "disciplineLabel": "Massage Therapy & Manual Lymphatic Drainage",
    "disciplines": [
      "Registered Massage Therapy",
      "Manual Lympathic Drainage"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjMtMTItMjQvMTcyOTA2LzQ4Mjg3OWVlLTc2NjgtNDZjNS1hYjRmLTFmMWM4NjM3NDFiNi9Lb21hbCBwaXguanBnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=74a3973aff24d947&for=reverewellness.janeapp.com",
    "shortBio": "CDI College RMT graduate certified in Manual Lymphatic Drainage (MLD) and Hot Stone therapy, specializing in post-surgical recovery, fluid reduction, and deep relaxation.",
    "bio": "Komalbir is an RMT graduate of CDI College with advanced training in Manual Lymphatic Drainage (MLD) and Hot Stone Therapy. \n\nHer specialized expertise in Manual Lymphatic Drainage is particularly beneficial for clients seeking post-surgical fluid reduction, management of lymphedema, detoxification, and gentle relief from chronic inflammatory conditions. Combined with her Registered Massage Therapy training, Komalbir provides a soothing, highly therapeutic experience tailored to individual healing journeys.",
    "specialties": [
      "Manual Lymphatic Drainage (MLD)",
      "Post-Surgical Healing & Edema Relief",
      "Hot Stone Massage",
      "Therapeutic Swedish Massage",
      "Prenatal / Postnatal Comfort"
    ],
    "education": "CDI College Registered Massage Therapy Program & MLD Certification",
    "languages": [
      "English",
      "Punjabi",
      "Hindi"
    ],
    "yearsExperience": "4+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      7,
      57,
      19,
      102,
      103,
      104,
      106,
      107
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/52",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 57,
        "name": "RMT Massage  (30 minutes)",
        "duration": 30,
        "price": 87.5,
        "description": "This session is for 30 mins only.  You cannot combine two 30-minute sessions into a 60-minute sessions.  It will be billed as two separate 30-minute sessions",
        "priceIncludesTax": true
      },
      {
        "id": 19,
        "name": "RMT Massage (45 minutes)",
        "duration": 45,
        "price": 110,
        "description": "Therapeutic or relaxation massage provided by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 102,
        "name": "Manual Lymphatic Massage (60 mins)",
        "duration": 65,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 103,
        "name": "Manual Lymphatic Massage (90 mins)",
        "duration": 95,
        "price": 190,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 104,
        "name": "Manual Lymphatic Massage (120 mins)",
        "duration": 125,
        "price": 250,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 106,
        "name": "Manual Lymphatic Massage - 30 mins",
        "duration": 35,
        "price": 97,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 107,
        "name": "RMT Massage with Hot stone - 30 mins",
        "duration": 30,
        "price": 93,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 94,
    "slug": "kaycee-tabora",
    "name": "Kaycee Tabora",
    "professionalName": "Kaycee Tabora, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjYtMDktMTYvMTkyOTE2LzRlZTQ2OTNhLTllYTQtNDdjMS05Mjk5LWMxNmY3YjBhOGRlMC9JTUdfNjIzMS5qcGVnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=40866dc85100f31f&for=reverewellness.janeapp.com",
    "shortBio": "Practicing since 2016, Kaycee builds strong patient-therapist relationships dedicated to achieving tension relief, deep tissue restoration, and sports recovery.",
    "bio": "I’ve been practising since 2016 and enjoy building professional patient-therapist relations with the common desire of achieving your goals, whether it be tension relief, relaxation, deep tissue, prenatal treatment or sports therapy.\n\nKaycee combines intuitive touch with anatomical precision. She works closely with each patient to identify the root cause of discomfort—be it from sports, postural fatigue, or repetitive strain—and provides targeted relief that leaves you feeling lighter, looser, and refreshed.",
    "specialties": [
      "Deep Tissue Massage",
      "Sports Recovery",
      "Prenatal Massage",
      "Hot Stone Therapy",
      "Tension & Headache Relief",
      "Relaxation Swedish"
    ],
    "education": "Registered Massage Therapy Program (Practicing Since 2016)",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "10+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      62
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/94",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 62,
        "name": "RMT Massage with Hot  Stone (60 minutes)",
        "duration": 60,
        "price": 143.5,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 57,
    "slug": "prabh-grewal",
    "name": "Prabh Grewal",
    "professionalName": "Prabh Grewal, RMT",
    "title": "Registered Massage Therapist",
    "credentials": "RMT, CCHPBC Registered",
    "disciplineCategory": "rmt",
    "disciplineLabel": "Registered Massage Therapy",
    "disciplines": [
      "Registered Massage Therapy"
    ],
    "photo": "https://assets-jane-cac1-15.janeapp.net/pub/W1siZiIsImRyYWdvbmZseS8yMTU1Ny91c2VyL3Bob3RvLzIwMjQtMDEtMDYvMjAxOTQ1LzBjZmNjY2MzLTBlZTYtNGYwNC04NzYxLTlhMzE1OTMzMTkyZS9QcmFiaCBQaG90by5qcGVnIl0sWyJwIiwidGh1bWIiLCI4MDB4MTA0MCMiXV0?sha=4c5d90b9927648a8&for=reverewellness.janeapp.com",
    "shortBio": "Results-driven Registered Massage Therapist focusing on deep tissue tension relief, ICBC motor vehicle accident rehabilitation, and athletic recovery.",
    "bio": "Prabh is a Registered Massage Therapist focused on helping patients recover from acute injuries, sports strain, and chronic pain syndromes. Prabh's treatments emphasize identifying functional imbalances and using targeted manual techniques to restore range of motion and relieve tension.\n\nPrabh provides direct billing for ICBC and major private extended health providers, making access to regular rehabilitation easy and stress-free.",
    "specialties": [
      "Deep Tissue Massage",
      "ICBC Motor Vehicle Rehab",
      "Sports Injury Treatment",
      "Myofascial Release",
      "Chronic Neck & Back Pain"
    ],
    "education": "Registered Massage Therapy Program Graduate",
    "languages": [
      "English",
      "Punjabi"
    ],
    "yearsExperience": "5+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      1,
      24,
      76,
      77,
      2
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/57",
    "treatments": [
      {
        "id": 1,
        "name": "RMT Massage (60 minutes)",
        "duration": 60,
        "price": 138,
        "description": "Therapeutic or relaxation massage performed by a professional Registered Massage Therapist",
        "priceIncludesTax": true
      },
      {
        "id": 24,
        "name": "RMT Massage - Pre / Post-natal (60 minutes)",
        "duration": 60,
        "price": 145,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 76,
        "name": "ICBC RMT Massage - Initial Session 45 mins",
        "duration": 55,
        "price": 131.25,
        "description": "  \r\n\r\n1.  Pls provide your ICBC claim no., date of accident and name / contact no of ICBC adjuster\r\n\r\n2.  Available only with Mandish Sehra.and Johan Colinco Prabh Grewal\r\n\r\n",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 93,
    "slug": "shairah-rodulfo",
    "name": "Shairah Rodulfo",
    "professionalName": "Shairah Rodulfo, B.Sc. Kin",
    "title": "Practicing Kinesiologist",
    "credentials": "BCAK Member, Kinesiologist",
    "disciplineCategory": "kinesiology",
    "disciplineLabel": "Kinesiology & Active Rehabilitation",
    "disciplines": [
      "Kinesiology"
    ],
    "photo": null,
    "shortBio": "Focused on human movement mechanics to guide clients through active ICBC recovery, posture correction, and tailored functional strength programs.",
    "bio": "Shairah is a Practicing Kinesiologist dedicated to human movement mechanics. She helps clients recover from motor vehicle accidents, manage persistent musculoskeletal conditions, and improve overall physical performance through structured 1-on-1 active rehab.\n\nWorking alongside our physiotherapists and massage therapists, Shairah creates personalized exercise routines that rebuild joint stability, correct postural compensations, and return patients safely to their work and favorite hobbies.",
    "specialties": [
      "ICBC Active Rehabilitation",
      "Functional Movement Screening",
      "Core & Postural Strengthening",
      "Injury Prevention Exercise",
      "Cardiovascular & Mobility Conditioning"
    ],
    "education": "Bachelor of Science in Kinesiology",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "4+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      110,
      111
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/93",
    "treatments": [
      {
        "id": 110,
        "name": "ICBC Kinesiology Initial Session",
        "duration": 45,
        "price": 0,
        "description": "ICBC Kinesiology Initial Session",
        "priceIncludesTax": true
      },
      {
        "id": 111,
        "name": "ICBC Kinesiology Subsequent Session",
        "duration": 45,
        "price": 0,
        "description": "ICBC Kinesiology Subsequent Session",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 80,
    "slug": "samraat-malhotra",
    "name": "Samraat Malhotra",
    "professionalName": "Samraat Malhotra, B.Sc. Kin",
    "title": "Practicing Kinesiologist",
    "credentials": "BCAK Member, Kinesiologist",
    "disciplineCategory": "kinesiology",
    "disciplineLabel": "Kinesiology & Active Rehabilitation",
    "disciplines": [
      "Kinesiology"
    ],
    "photo": null,
    "shortBio": "Active rehab and exercise therapy specialist dedicated to guiding ICBC patients and athletes through individualized strength and functional recovery.",
    "bio": "Samraat is a Kinesiologist specializing in active rehabilitation programs. He focuses on restoring biomechanical efficiency, muscle balance, and athletic agility for individuals recovering from motor vehicle collisions and sports injuries.\n\nThrough gradual progressive loading and mindful movement coaching, Samraat ensures that patients build true functional endurance and long-term joint health.",
    "specialties": [
      "ICBC Active Rehab",
      "Athletic Conditioning",
      "Resistance & Mobility Training",
      "Ergonomic & Posture Coaching"
    ],
    "education": "Degree in Kinesiology & Exercise Science",
    "languages": [
      "English",
      "Hindi",
      "Punjabi"
    ],
    "yearsExperience": "4+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      69,
      109
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/80",
    "treatments": [
      {
        "id": 69,
        "name": "ICBC - Kinesiology Initial Session (45 mins)",
        "duration": 45,
        "price": 0,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 109,
        "name": "ICBC - Kinesiology Subsequent Session (45 mins)",
        "duration": 45,
        "price": 0,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  },
  {
    "id": 95,
    "slug": "tiffany-grace-ezpeleta",
    "name": "Tiffany Grace Ezpeleta",
    "professionalName": "Tiffany Grace Ezpeleta, PT",
    "title": "Registered Physiotherapist",
    "credentials": "PT, CHCPBC Registered",
    "disciplineCategory": "physio",
    "disciplineLabel": "Physiotherapy & WorkSafeBC",
    "disciplines": [
      "Physiotherapy"
    ],
    "photo": null,
    "shortBio": "Compassionate Physiotherapist delivering clinical assessments, manual therapy, and tailored recovery programs for ICBC, WorkSafeBC, and private clients.",
    "bio": "Tiffany is a Registered Physiotherapist passionate about restoring movement and empowering clients through evidence-informed physiotherapy. She works closely with patients experiencing acute injuries, chronic spine stiffness, and workplace or motor vehicle accidents.\n\nHer sessions integrate hands-on manual techniques, therapeutic modalities, and tailored corrective exercise to guide you smoothly back to pain-free daily activities.",
    "specialties": [
      "Orthopedic Physiotherapy",
      "WorkSafeBC & ICBC Claims",
      "Manual Therapy",
      "Functional Range of Motion",
      "Post-Injury Exercise Programs"
    ],
    "education": "Bachelor of Science in Physical Therapy",
    "languages": [
      "English",
      "Tagalog"
    ],
    "yearsExperience": "6+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      51,
      99,
      48,
      49,
      50
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/95",
    "treatments": [
      {
        "id": 51,
        "name": "Physiotherapy- Subsequent visit (45 mins)",
        "duration": 45,
        "price": 128,
        "description": "Physiotherapy- Subsequent visit (45 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 99,
        "name": "Physiotherapy  IMS /  Dry needling - Subsequent (45 minutes)",
        "duration": 45,
        "price": 160,
        "description": "",
        "priceIncludesTax": false
      },
      {
        "id": 48,
        "name": "Physiotherapy-Initial visit (60mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy-initial visit (60 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 49,
        "name": "Physiotherapy-Subsequent visit (60 mins)",
        "duration": 60,
        "price": 160,
        "description": "Physiotherapy-Subsequent visit (60 mins)",
        "priceIncludesTax": false
      },
      {
        "id": 50,
        "name": "Physiotherapy-initial visit (45 mins)",
        "duration": 45,
        "price": 128,
        "description": "Physiotherapy-initial visit (45 mins)",
        "priceIncludesTax": false
      }
    ]
  },
  {
    "id": 88,
    "slug": "aniqa-bajwa",
    "name": "Aniqa Bajwa",
    "professionalName": "Aniqa Bajwa",
    "title": "Active Rehabilitation Specialist",
    "credentials": "Rehab Specialist",
    "disciplineCategory": "kinesiology",
    "disciplineLabel": "Kinesiology & Movement Therapy",
    "disciplines": [
      "Kinesiology"
    ],
    "photo": null,
    "shortBio": "Passionate about functional recovery and empowering patients to regain confidence, strength, and mobility after injuries.",
    "bio": "Aniqa works with patients who want to transition from acute pain relief into lasting physical resilience. Through targeted kinesiology sessions, she helps clients restore flexibility, stabilize core musculature, and prevent reinjury following ICBC motor vehicle accidents.",
    "specialties": [
      "Active Rehabilitation",
      "Movement Re-education",
      "Core Stabilization",
      "ICBC Direct Billing"
    ],
    "education": "Kinesiology & Health Science Studies",
    "languages": [
      "English",
      "Urdu",
      "Punjabi"
    ],
    "yearsExperience": "3+ Years",
    "allowOnlineBooking": true,
    "treatmentIds": [
      69,
      109
    ],
    "janeBookingUrl": "https://reverewellness.janeapp.com/#/staff_member/88",
    "treatments": [
      {
        "id": 69,
        "name": "ICBC - Kinesiology Initial Session (45 mins)",
        "duration": 45,
        "price": 0,
        "description": "",
        "priceIncludesTax": true
      },
      {
        "id": 109,
        "name": "ICBC - Kinesiology Subsequent Session (45 mins)",
        "duration": 45,
        "price": 0,
        "description": "",
        "priceIncludesTax": true
      }
    ]
  }
];

export const DISCIPLINE_FILTERS = [
  { id: 'all', label: 'All Practitioners' },
  { id: 'rmt', label: 'Massage Therapy (RMT)' },
  { id: 'physio', label: 'Physiotherapy' },
  { id: 'kinesiology', label: 'Kinesiology & Active Rehab' },
  { id: 'mld', label: 'Lymphatic Drainage (MLD)' }
];

export const PRACTITIONERS_STORAGE_KEY = 'revere_practitioners';

/**
 * Get current active practitioners from localStorage or initial defaults
 */
export function getStoredPractitioners() {
  if (typeof window === 'undefined') return DEFAULT_PRACTITIONERS;
  try {
    const raw = localStorage.getItem(PRACTITIONERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored practitioners:', e);
  }
  return DEFAULT_PRACTITIONERS;
}

/**
 * Save practitioners locally and asynchronously sync to Supabase database
 */
export function savePractitioners(newList) {
  if (!Array.isArray(newList)) return newList;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PRACTITIONERS_STORAGE_KEY, JSON.stringify(newList));
      window.dispatchEvent(new CustomEvent('revere-practitioners-updated', { detail: newList }));
    } catch (e) {
      console.warn('Error saving practitioners to localStorage:', e);
    }
  }

  // Cloud sync to Supabase in background
  savePractitionersToDb(newList).catch(err => {
    console.warn('Cloud sync error saving practitioners:', err);
  });

  return newList;
}

/**
 * Sync practitioners from Supabase database to local storage
 */
export async function syncPractitionersFromDb() {
  try {
    const dbList = await fetchPractitionersFromDb();
    if (Array.isArray(dbList) && dbList.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(PRACTITIONERS_STORAGE_KEY, JSON.stringify(dbList));
        window.dispatchEvent(new CustomEvent('revere-practitioners-updated', { detail: dbList }));
      }
      return dbList;
    }
  } catch (err) {
    console.warn('Error syncing practitioners from DB:', err);
  }
  return null;
}

/**
 * Reset practitioners list back to the 18 factory defaults
 */
export function resetPractitionersToDefaults() {
  return savePractitioners(DEFAULT_PRACTITIONERS);
}

export function getPractitionerBySlug(slug, list) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  const pool = list || getStoredPractitioners();
  return pool.find(p => p.slug === normalized) || null;
}

export function getPractitionersByCategory(category, list) {
  const pool = list || getStoredPractitioners();
  if (!category || category === 'all') return pool;
  return pool.filter(p => p.disciplineCategory === category);
}

// Export default reference for backward compatibility
export const PRACTITIONERS = DEFAULT_PRACTITIONERS;
