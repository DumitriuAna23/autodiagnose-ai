DIAGNOSTIC_RULES = [
    # =========================================================
    # BOOST / TURBO
    # =========================================================

    {
        "rule_id": "KB-001",
        "probable_cause": {
            "en": "Boost pressure system underperformance",
            "ro": "Presiune de supraalimentare insuficientă",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "excluded_context_evidence": [
            "naturally_aspirated",
        ],
        "symptom_weights": {
            "warning": 10,
            "power": 15,
        },
        "dtc_weights": {
            "P0299": 60,
        },
        "adaptive_weights": {
            "performance_change=yes": 10,
            "warning_light=yes": 5,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "loss_of_power": 10,
            "under_acceleration": 10,
            "whistling_noise": 5,
        },
        "severity": "medium",
        "description": {
            "en": (
                "DTC P0299 indicates that the engine control system "
                "detected lower boost pressure than expected from the "
                "turbocharger or supercharger system."
            ),
            "ro": (
                "Codul DTC P0299 indică faptul că sistemul de control "
                "al motorului a detectat o presiune de supraalimentare "
                "mai mică decât valoarea așteptată."
            ),
        },
        "recommended_checks": {
            "en": [
                "Inspect boost and intake hoses for leaks or disconnections",
                "Check turbocharger or boost-control actuator operation",
                "Inspect boost pressure sensor readings",
                "Check vacuum or electronic boost-control components",
            ],
            "ro": [
                "Verifică furtunurile de admisie și supraalimentare pentru pierderi sau deconectări",
                "Verifică funcționarea actuatorului turbinei sau a sistemului de control al presiunii",
                "Verifică valorile senzorului de presiune de supraalimentare",
                "Verifică sistemul de vacuum sau componentele electronice de control al presiunii",
            ],
        },
    },

    {
        "rule_id": "KB-002",
        "probable_cause": {
            "en": "Boost or intake air leak",
            "ro": "Pierdere de aer pe traseul de admisie sau supraalimentare",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "excluded_context_evidence": [
            "naturally_aspirated",
        ],
        "symptom_weights": {
            "power": 20,
        },
        "dtc_weights": {
            "P0299": 45,
        },
        "adaptive_weights": {
            "performance_change=yes": 15,
            "onset=sudden": 10,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "loss_of_power": 10,
            "under_acceleration": 10,
            "whistling_noise": 15,
        },
        "severity": "medium",
        "description": {
            "en": (
                "A leak between the turbocharger, intercooler, intake "
                "piping, or intake manifold can reduce the boost "
                "pressure reaching the engine."
            ),
            "ro": (
                "O pierdere de aer între turbocompresor, intercooler, "
                "conductele de admisie sau galeria de admisie poate "
                "reduce presiunea de supraalimentare care ajunge la motor."
            ),
        },
        "recommended_checks": {
            "en": [
                "Inspect intercooler hoses and connections",
                "Check intake pipes for cracks or loose clamps",
                "Perform a boost leak or smoke test when appropriate",
            ],
            "ro": [
                "Verifică furtunurile intercoolerului și conexiunile acestora",
                "Verifică traseul de admisie pentru fisuri sau coliere slăbite",
                "Efectuează, dacă este posibil, un test de etanșeitate sau un test cu fum",
            ],
        },
    },

    {
        "rule_id": "KB-003",
        "probable_cause": {
            "en": "Turbocharger or boost-control fault",
            "ro": "Problemă la turbocompresor sau la sistemul de control al presiunii",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "excluded_context_evidence": [
            "naturally_aspirated",
        ],
        "symptom_weights": {
            "power": 15,
        },
        "dtc_weights": {
            "P0299": 40,
        },
        "adaptive_weights": {
            "performance_change=yes": 10,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "loss_of_power": 10,
            "under_acceleration": 10,
            "whistling_noise": 10,
        },
        "context_weights": {
            "previous_turbo_issue": 10,
            "previous_turbo_repair": 7,
            "stage_1_tune": 5,
            "stage_2_tune": 5,
        },
        "severity": "high",
        "description": {
            "en": (
                "A turbocharger, wastegate, actuator, or related "
                "boost-control fault may prevent the requested boost "
                "pressure from being reached."
            ),
            "ro": (
                "O problemă la turbocompresor, wastegate, actuator sau "
                "la sistemul de control al presiunii poate împiedica "
                "atingerea presiunii de supraalimentare solicitate."
            ),
        },
        "recommended_checks": {
            "en": [
                "Check wastegate or boost actuator movement",
                "Inspect boost-control wiring and connectors",
                "Compare requested and measured boost pressure",
                "Inspect turbocharger condition if other checks are normal",
            ],
            "ro": [
                "Verifică mișcarea wastegate-ului sau a actuatorului turbinei",
                "Verifică firele și conectorii sistemului de control al presiunii",
                "Compară presiunea de supraalimentare solicitată cu cea măsurată",
                "Verifică starea turbocompresorului dacă celelalte verificări sunt normale",
            ],
        },
    },

    # =========================================================
    # BATTERY / STARTING
    # =========================================================

    {
        "rule_id": "KB-004",
        "probable_cause": {
            "en": "Low system voltage or battery/charging issue",
            "ro": "Tensiune electrică scăzută sau problemă la baterie/încărcare",
        },
        "base_score": 10,
        "symptom_weights": {
            "starting": 20,
            "warning": 10,
        },
        "dtc_weights": {
            "P0562": 55,
        },
        "adaptive_weights": {
            "frequency=always": 5,
            "warning_light=yes": 5,
        },
        "text_evidence_weights": {
            "hard_start": 15,
            "warning_light": 5,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Low electrical system voltage can cause difficult "
                "starting, warning lights, unstable electronic systems, "
                "or other electrical symptoms."
            ),
            "ro": (
                "Tensiunea scăzută a sistemului electric poate provoca "
                "pornire dificilă, martori în bord, funcționare instabilă "
                "a sistemelor electronice sau alte simptome electrice."
            ),
        },
        "recommended_checks": {
            "en": [
                "Check battery voltage and battery condition",
                "Inspect battery terminals and ground connections",
                "Check charging voltage with the engine running",
                "Inspect the charging system if voltage remains low",
            ],
            "ro": [
                "Verifică tensiunea și starea bateriei",
                "Verifică bornele bateriei și conexiunile de masă",
                "Verifică tensiunea de încărcare cu motorul pornit",
                "Verifică sistemul de încărcare dacă tensiunea rămâne scăzută",
            ],
        },
    },

    {
        "rule_id": "KB-005",
        "probable_cause": {
            "en": "Starter circuit or starter motor fault",
            "ro": "Problemă la circuitul de pornire sau electromotor",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "starting": 25,
        },
        "dtc_weights": {
            "P0615": 50,
        },
        "adaptive_weights": {
            "onset=sudden": 10,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "hard_start": 20,
        },
        "severity": "medium",
        "description": {
            "en": (
                "A fault in the starter motor, starter relay, wiring, "
                "or related starting circuit can prevent the engine "
                "from cranking normally."
            ),
            "ro": (
                "O problemă la electromotor, releul de pornire, cablaj "
                "sau circuitul de pornire poate împiedica motorul să "
                "fie antrenat normal la pornire."
            ),
        },
        "recommended_checks": {
            "en": [
                "Check whether the starter motor cranks the engine",
                "Inspect starter relay and related wiring",
                "Check battery voltage during cranking",
                "Inspect starter motor electrical connections",
            ],
            "ro": [
                "Verifică dacă electromotorul antrenează motorul",
                "Verifică releul de pornire și cablajul asociat",
                "Verifică tensiunea bateriei în timpul pornirii",
                "Verifică conexiunile electrice ale electromotorului",
            ],
        },
    },

    {
        "rule_id": "KB-006",
        "probable_cause": {
            "en": "Crankshaft position sensor or engine-speed signal fault",
            "ro": "Problemă la senzorul de poziție al arborelui cotit sau semnalul de turație",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "starting": 20,
            "warning": 10,
        },
        "dtc_weights": {
            "P0335": 55,
        },
        "adaptive_weights": {
            "onset=sudden": 10,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "hard_start": 10,
            "engine_stall": 20,
            "warning_light": 5,
        },
        "severity": "high",
        "description": {
            "en": (
                "An unreliable crankshaft-position or engine-speed signal "
                "can cause difficult starting, engine stalling, or a "
                "complete no-start condition."
            ),
            "ro": (
                "Un semnal incorect de la senzorul arborelui cotit sau "
                "de turație poate provoca pornire dificilă, oprirea "
                "motorului sau imposibilitatea pornirii."
            ),
        },
        "recommended_checks": {
            "en": [
                "Read crankshaft-position related fault codes",
                "Inspect sensor wiring and connector condition",
                "Check engine-speed signal during cranking",
                "Test the crankshaft-position sensor when appropriate",
            ],
            "ro": [
                "Verifică eventualele coduri asociate senzorului arborelui cotit",
                "Verifică firele și conectorul senzorului",
                "Verifică semnalul de turație în timpul pornirii",
                "Testează senzorul de poziție al arborelui cotit dacă este necesar",
            ],
        },
    },

    # =========================================================
    # MISFIRE / ENGINE RUNNING
    # =========================================================

    {
        "rule_id": "KB-007",
        "probable_cause": {
            "en": "Engine misfire or combustion irregularity",
            "ro": "Rateu de aprindere sau funcționare neregulată a motorului",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "starting": 15,
            "noise": 20,
            "warning": 10,
            "power": 10,
        },
        "dtc_weights": {
            "P0300": 55,
        },
        "adaptive_weights": {
            "performance_change=yes": 10,
            "warning_light=yes": 5,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "hesitation": 10,
            "engine_vibration": 20,
            "loss_of_power": 10,
            "warning_light": 5,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Irregular combustion in one or more cylinders can "
                "produce vibration, hesitation, reduced power, and "
                "engine warning indications."
            ),
            "ro": (
                "Arderea neregulată într-unul sau mai mulți cilindri "
                "poate provoca vibrații, ezitare, pierdere de putere "
                "și aprinderea martorului motor."
            ),
        },
        "recommended_checks": {
            "en": [
                "Read misfire counters and related DTCs",
                "Inspect spark plugs and ignition components where applicable",
                "Check fuel-injection operation",
                "Check compression if ignition and fueling checks are normal",
            ],
            "ro": [
                "Verifică contoarele de misfire și codurile DTC asociate",
                "Verifică bujiile și sistemul de aprindere unde este cazul",
                "Verifică funcționarea injectoarelor",
                "Verifică compresia dacă aprinderea și alimentarea sunt normale",
            ],
        },
    },

    # =========================================================
    # AIR / FUEL
    # =========================================================

    {
        "rule_id": "KB-008",
        "probable_cause": {
            "en": "Air-fuel mixture or intake metering fault",
            "ro": "Problemă de amestec aer-combustibil sau măsurare a aerului admis",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "power": 15,
            "starting": 10,
            "warning": 10,
            "smoke": 10,
        },
        "dtc_weights": {
            "P0171": 50,
            "P0172": 50,
            "P0101": 45,
        },
        "adaptive_weights": {
            "performance_change=yes": 10,
            "warning_light=yes": 5,
        },
        "text_evidence_weights": {
            "loss_of_power": 10,
            "hesitation": 10,
            "smoke": 10,
            "warning_light": 5,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Incorrect measurement of intake air, an intake leak, "
                "or a fueling problem can cause the engine to operate "
                "with an incorrect air-fuel mixture."
            ),
            "ro": (
                "Măsurarea incorectă a aerului admis, o pierdere pe "
                "admisie sau o problemă de alimentare poate determina "
                "funcționarea motorului cu un amestec aer-combustibil incorect."
            ),
        },
        "recommended_checks": {
            "en": [
                "Inspect intake hoses for leaks",
                "Check MAF sensor readings where fitted",
                "Inspect fuel-trim values with a diagnostic scanner",
                "Check fuel pressure and injection system if needed",
            ],
            "ro": [
                "Verifică traseul de admisie pentru pierderi",
                "Verifică valorile senzorului MAF dacă vehiculul este echipat cu acesta",
                "Verifică valorile fuel trim cu un tester de diagnostic",
                "Verifică presiunea combustibilului și sistemul de injecție dacă este necesar",
            ],
        },
    },

    # =========================================================
    # EGR
    # =========================================================

    {
        "rule_id": "KB-009",
        "probable_cause": {
            "en": "EGR flow or exhaust-gas recirculation fault",
            "ro": "Problemă la sistemul EGR sau debitul de recirculare a gazelor",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "power": 15,
            "smoke": 15,
            "warning": 10,
        },
        "dtc_weights": {
            "P0401": 55,
        },
        "adaptive_weights": {
            "performance_change=yes": 10,
            "warning_light=yes": 5,
        },
        "text_evidence_weights": {
            "loss_of_power": 10,
            "hesitation": 10,
            "smoke": 10,
            "warning_light": 5,
        },
        "context_weights": {
            "previous_egr_issue": 10,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Restricted, insufficient, or incorrectly controlled "
                "EGR flow may affect engine performance and emissions."
            ),
            "ro": (
                "Un debit EGR insuficient, restricționat sau controlat "
                "incorect poate afecta performanța motorului și emisiile."
            ),
        },
        "recommended_checks": {
            "en": [
                "Inspect EGR valve operation",
                "Check EGR passages for deposits or restrictions",
                "Inspect related sensors, wiring, and connectors",
                "Compare commanded and measured EGR operation where available",
            ],
            "ro": [
                "Verifică funcționarea supapei EGR",
                "Verifică traseele EGR pentru depuneri sau blocaje",
                "Verifică senzorii, cablajul și conectorii asociați",
                "Compară valorile EGR comandate și măsurate dacă sunt disponibile",
            ],
        },
    },

    # =========================================================
    # COOLING SYSTEM
    # =========================================================

    {
        "rule_id": "KB-010",
        "probable_cause": {
            "en": "Thermostat or coolant temperature regulation issue",
            "ro": "Problemă la termostat sau reglarea temperaturii lichidului de răcire",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "temperature": 25,
            "warning": 5,
        },
        "dtc_weights": {
            "P0128": 55,
        },
        "adaptive_weights": {
            "warning_light=yes": 5,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "overheating": 10,
            "warning_light": 5,
        },
        "severity": "medium",
        "description": {
            "en": (
                "A thermostat or coolant-temperature regulation problem "
                "can prevent the engine from reaching or maintaining "
                "its expected operating temperature."
            ),
            "ro": (
                "O problemă la termostat sau la reglarea temperaturii "
                "lichidului de răcire poate împiedica motorul să atingă "
                "sau să mențină temperatura normală de funcționare."
            ),
        },
        "recommended_checks": {
            "en": [
                "Check coolant level when the engine is cold",
                "Inspect thermostat operation",
                "Compare coolant temperature sensor data with actual temperature",
                "Inspect the cooling system for leaks",
            ],
            "ro": [
                "Verifică nivelul lichidului de răcire cu motorul rece",
                "Verifică funcționarea termostatului",
                "Compară datele senzorului de temperatură cu temperatura reală",
                "Verifică sistemul de răcire pentru pierderi",
            ],
        },
    },

    {
        "rule_id": "KB-011",
        "probable_cause": {
            "en": "Engine overheating or cooling-system fault",
            "ro": "Supraîncălzirea motorului sau problemă la sistemul de răcire",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "temperature": 30,
            "warning": 10,
        },
        "dtc_weights": {
            "P0217": 60,
        },
        "adaptive_weights": {
            "warning_light=yes": 5,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "overheating": 25,
            "warning_light": 5,
        },
        "context_weights": {
            "previous_cooling_issue": 10,
        },
        "severity": "high",
                "urgency": "stop_driving",
        "safety_message": {
            "en": "If the engine is overheating, stop the vehicle safely and do not continue driving. Continued operation may cause serious engine damage.",
            "ro": "Dacă motorul se supraîncălzește, oprește vehiculul în siguranță și nu continua deplasarea. Continuarea mersului poate produce avarii grave motorului.",
        },
"description": {
            "en": (
                "Engine overheating may result from insufficient coolant, "
                "poor coolant circulation, fan failure, leakage, or another "
                "cooling-system fault."
            ),
            "ro": (
                "Supraîncălzirea motorului poate fi provocată de nivel "
                "insuficient al lichidului de răcire, circulație deficitară, "
                "ventilator defect, pierderi sau alte probleme ale sistemului de răcire."
            ),
        },
        "recommended_checks": {
            "en": [
                "Do not continue driving if the engine is actively overheating",
                "Check coolant level only when it is safe and the engine has cooled",
                "Inspect the cooling system for leaks",
                "Check radiator fan and coolant circulation",
                "Inspect thermostat and water-pump operation",
            ],
            "ro": [
                "Nu continua deplasarea dacă motorul se supraîncălzește activ",
                "Verifică nivelul lichidului de răcire doar după răcirea motorului și în condiții de siguranță",
                "Verifică sistemul de răcire pentru pierderi",
                "Verifică ventilatorul radiatorului și circulația lichidului",
                "Verifică termostatul și funcționarea pompei de apă",
            ],
        },
    },

    # =========================================================
    # BRAKING
    # =========================================================

    {
        "rule_id": "KB-012",
        "probable_cause": {
            "en": "Braking-system fault",
            "ro": "Problemă la sistemul de frânare",
        },
        "base_score": 10,
        "symptom_weights": {
            "brakes": 30,
        },
        "dtc_weights": {},
        "adaptive_weights": {
            "onset=sudden": 10,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "braking_issue": 35,
        },
        "context_weights": {
            "previous_braking_issue": 10,
        },
        "severity": "high",
                "urgency": "stop_driving",
        "safety_message": {
            "en": "If braking performance is reduced, the pedal behaves abnormally, or vehicle control is affected, do not continue driving. Stop safely and seek assistance.",
            "ro": "Dacă eficiența frânării este redusă, pedala se comportă anormal sau controlul vehiculului este afectat, nu continua deplasarea. Oprește în siguranță și solicită asistență.",
        },
"description": {
            "en": (
                "Changes in braking response, pedal behavior, braking "
                "distance, or brake-system warnings may indicate a "
                "safety-critical braking fault."
            ),
            "ro": (
                "Schimbările în comportamentul frânei, al pedalei, "
                "distanței de frânare sau apariția avertizărilor pot "
                "indica o problemă importantă a sistemului de frânare."
            ),
        },
        "recommended_checks": {
            "en": [
                "Do not continue driving if braking performance is significantly reduced",
                "Inspect brake-fluid level and visible leaks",
                "Inspect brake pads, discs, and hydraulic components",
                "Scan the ABS/brake control system for stored fault codes",
            ],
            "ro": [
                "Nu continua deplasarea dacă eficiența frânării este semnificativ redusă",
                "Verifică nivelul lichidului de frână și eventualele pierderi vizibile",
                "Verifică plăcuțele, discurile și componentele hidraulice",
                "Scanează sistemul ABS/frânare pentru coduri de eroare memorate",
            ],
        },
    },

    # =========================================================
    # STEERING
    # =========================================================

    {
        "rule_id": "KB-013",
        "probable_cause": {
            "en": "Steering or power-steering system fault",
            "ro": "Problemă la sistemul de direcție sau servodirecție",
        },
        "base_score": 10,
        "symptom_weights": {
            "brakes": 20,
        },
        "dtc_weights": {},
        "adaptive_weights": {
            "onset=sudden": 10,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "steering_issue": 40,
        },
        "severity": "high",
                "urgency": "stop_driving",
        "safety_message": {
            "en": "If steering is heavy, unpredictable, or vehicle control is affected, do not continue driving. Stop safely and seek assistance.",
            "ro": "Dacă direcția este grea, imprevizibilă sau controlul vehiculului este afectat, nu continua deplasarea. Oprește în siguranță și solicită asistență.",
        },
"description": {
            "en": (
                "Abnormal steering effort, steering response, noise, or "
                "loss of assistance may indicate a mechanical or "
                "power-steering system fault."
            ),
            "ro": (
                "Efortul anormal la volan, răspunsul direcției, zgomotele "
                "sau pierderea asistenței pot indica o problemă mecanică "
                "sau la sistemul de servodirecție."
            ),
        },
        "recommended_checks": {
            "en": [
                "Do not continue driving if steering control is significantly affected",
                "Check tire condition and tire pressure",
                "Inspect steering components for visible damage or excessive play",
                "Check power-steering or electric-steering fault codes where applicable",
            ],
            "ro": [
                "Nu continua deplasarea dacă controlul direcției este semnificativ afectat",
                "Verifică starea și presiunea anvelopelor",
                "Verifică componentele direcției pentru deteriorări sau joc excesiv",
                "Verifică eventualele coduri de eroare ale servodirecției electrice sau hidraulice",
            ],
        },
    },

    # =========================================================
    # NOISE / VIBRATION
    # =========================================================

    {
        "rule_id": "KB-014",
        "probable_cause": {
            "en": "Mechanical, intake, or accessory-related noise",
            "ro": "Zgomot de origine mecanică, admisie sau accesorii motor",
        },
        "base_score": 10,
        "symptom_weights": {
            "noise": 25,
        },
        "dtc_weights": {},
        "adaptive_weights": {
            "onset=sudden": 5,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "unusual_noise": 25,
            "whistling_noise": 15,
            "engine_vibration": 10,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Unusual noises or vibrations may originate from the "
                "engine, intake system, rotating accessories, mounts, "
                "or other mechanical components."
            ),
            "ro": (
                "Zgomotele sau vibrațiile neobișnuite pot proveni de la "
                "motor, sistemul de admisie, accesorii rotative, suporturi "
                "sau alte componente mecanice."
            ),
        },
        "recommended_checks": {
            "en": [
                "Determine when and where the noise is most noticeable",
                "Inspect intake pipes and connections",
                "Inspect belts, pulleys, and rotating accessories",
                "Check engine and transmission mounts if vibration is present",
            ],
            "ro": [
                "Identifică momentul și zona în care zgomotul este cel mai evident",
                "Verifică traseul de admisie și conexiunile",
                "Verifică curelele, rolele și accesoriile rotative",
                "Verifică suporturile motorului și transmisiei dacă sunt prezente vibrații",
            ],
        },
    },

    # =========================================================
    # SMOKE
    # =========================================================

    {
        "rule_id": "KB-015",
        "probable_cause": {
            "en": "Abnormal combustion or fluid entering the combustion/exhaust system",
            "ro": "Ardere anormală sau pătrunderea unui fluid în sistemul de ardere/evacuare",
        },
        "base_score": 10,
        "applicable_fuel_types": [
            "petrol",
            "diesel",
            "hybrid",
        ],
        "symptom_weights": {
            "smoke": 30,
        },
        "dtc_weights": {},
        "adaptive_weights": {
            "performance_change=yes": 5,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "smoke": 30,
            "loss_of_power": 5,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Abnormal exhaust smoke may be associated with incorrect "
                "fueling, oil consumption, coolant entering the combustion "
                "process, or another engine or exhaust-system problem."
            ),
            "ro": (
                "Fumul anormal la evacuare poate fi asociat cu alimentarea "
                "incorectă, consumul de ulei, pătrunderea lichidului de răcire "
                "în procesul de ardere sau alte probleme ale motorului ori evacuării."
            ),
        },
        "recommended_checks": {
            "en": [
                "Observe smoke color and when it appears",
                "Check engine-oil and coolant levels",
                "Inspect fuel-trim and engine-management data",
                "Inspect PCV, injection, and engine mechanical condition where appropriate",
            ],
            "ro": [
                "Observă culoarea fumului și momentul în care apare",
                "Verifică nivelul uleiului și al lichidului de răcire",
                "Verifică valorile fuel trim și datele sistemului de management al motorului",
                "Verifică sistemul PCV, injecția și starea mecanică a motorului dacă este necesar",
            ],
        },
    },

    # =========================================================
    # GENERAL WARNING LIGHT
    # =========================================================

    {
        "rule_id": "KB-016",
        "probable_cause": {
            "en": "Electronic control or monitored-system fault",
            "ro": "Problemă la un sistem monitorizat sau la controlul electronic",
        },
        "base_score": 10,
        "symptom_weights": {
            "warning": 25,
        },
        "dtc_weights": {},
        "adaptive_weights": {
            "warning_light=yes": 15,
            "frequency=always": 5,
        },
        "text_evidence_weights": {
            "warning_light": 20,
        },
        "severity": "medium",
        "description": {
            "en": (
                "A dashboard warning light indicates that at least one "
                "vehicle control module detected a condition requiring "
                "diagnostic investigation."
            ),
            "ro": (
                "Aprinderea unui martor în bord indică faptul că cel puțin "
                "un modul electronic al vehiculului a detectat o condiție "
                "care necesită verificare."
            ),
        },
        "recommended_checks": {
            "en": [
                "Identify the exact warning light",
                "Scan the relevant vehicle modules for diagnostic trouble codes",
                "Record freeze-frame and live data where available",
                "Investigate the specific system indicated by the stored codes",
            ],
            "ro": [
                "Identifică exact martorul aprins",
                "Scanează modulele relevante pentru coduri de eroare",
                "Salvează datele freeze-frame și live data dacă sunt disponibile",
                "Verifică sistemul indicat de codurile de eroare memorate",
            ],
        },
    },

    # =========================================================
    # DIESEL - DPF
    # =========================================================

    {
        "rule_id": "KB-017",
        "probable_cause": {
            "en": "Diesel particulate filter restriction or regeneration issue",
            "ro": "Filtru de particule DPF încărcat sau problemă de regenerare",
        },
        "base_score": 10,

        "applicable_fuel_types": [
            "diesel",
        ],

        "symptom_weights": {
            "power": 15,
            "smoke": 15,
            "warning": 10,
        },

        "dtc_weights": {
            "P2463": 60,
            "P2459": 45,
        },

        "adaptive_weights": {
            "performance_change=yes": 10,
            "warning_light=yes": 5,
            "frequency=always": 5,
        },

        "text_evidence_weights": {
            "loss_of_power": 10,
            "under_acceleration": 10,
            "smoke": 10,
            "warning_light": 5,
        },

        "context_weights": {
            "previous_dpf_issue": 10,
        },

        "severity": "medium",

        "description": {
            "en": (
                "Excessive soot accumulation or unsuccessful regeneration "
                "may restrict the diesel particulate filter and reduce "
                "engine performance."
            ),
            "ro": (
                "Acumularea excesivă de funingine sau regenerările "
                "nereușite pot încărca filtrul de particule DPF și pot "
                "reduce performanța motorului."
            ),
        },

        "recommended_checks": {
            "en": [
                "Read DPF soot-load and differential-pressure values",
                "Check DPF differential-pressure sensor readings",
                "Inspect exhaust-temperature sensor data",
                "Check whether regeneration has been interrupted or inhibited",
                "Inspect the DPF system before attempting forced regeneration",
            ],
            "ro": [
                "Verifică gradul de încărcare cu funingine și presiunea diferențială a DPF-ului",
                "Verifică valorile senzorului de presiune diferențială",
                "Verifică datele senzorilor de temperatură a gazelor de evacuare",
                "Verifică dacă regenerările au fost întrerupte sau blocate",
                "Verifică sistemul DPF înainte de efectuarea unei regenerări forțate",
            ],
        },
    },

    # =========================================================
    # DIESEL - GLOW PLUG SYSTEM
    # =========================================================

    {
        "rule_id": "KB-018",
        "probable_cause": {
            "en": "Glow plug or glow plug control-system fault",
            "ro": "Problemă la bujiile incandescente sau sistemul lor de comandă",
        },
        "base_score": 10,

        "applicable_fuel_types": [
            "diesel",
        ],

        "symptom_weights": {
            "starting": 25,
            "warning": 10,
        },

        "dtc_weights": {
            "P0380": 55,
            "P0670": 55,
        },

        "adaptive_weights": {
            "frequency=always": 5,
            "warning_light=yes": 5,
        },

        "text_evidence_weights": {
            "hard_start": 25,
            "warning_light": 5,
        },

        "severity": "medium",

        "description": {
            "en": (
                "A glow plug, glow plug relay, control module, or wiring "
                "fault can make a diesel engine difficult to start, "
                "especially when the engine is cold."
            ),
            "ro": (
                "O problemă la bujiile incandescente, releul acestora, "
                "modulul de comandă sau cablaj poate face un motor diesel "
                "dificil de pornit, în special atunci când este rece."
            ),
        },

        "recommended_checks": {
            "en": [
                "Check glow plug related DTCs",
                "Measure glow plug electrical resistance where appropriate",
                "Inspect glow plug wiring and connectors",
                "Check glow plug relay or control-module operation",
            ],
            "ro": [
                "Verifică eventualele coduri DTC asociate bujiilor incandescente",
                "Măsoară rezistența electrică a bujiilor incandescente dacă este necesar",
                "Verifică firele și conectorii sistemului",
                "Verifică funcționarea releului sau modulului de comandă al bujiilor",
            ],
        },
    },

    # =========================================================
    # PETROL - IGNITION SYSTEM
    # =========================================================

    {
        "rule_id": "KB-019",
        "probable_cause": {
            "en": "Ignition coil or spark plug fault",
            "ro": "Problemă la bobina de inducție sau bujie",
        },
        "base_score": 10,

        "applicable_fuel_types": [
            "petrol",
        ],

        "symptom_weights": {
            "starting": 15,
            "noise": 15,
            "power": 15,
            "warning": 10,
        },

        "dtc_weights": {
            "P0351": 55,
            "P0352": 55,
            "P0353": 55,
            "P0354": 55,
            "P0301": 35,
            "P0302": 35,
            "P0303": 35,
            "P0304": 35,
        },

        "adaptive_weights": {
            "performance_change=yes": 10,
            "warning_light=yes": 5,
            "frequency=always": 5,
        },

        "text_evidence_weights": {
            "engine_vibration": 20,
            "hesitation": 15,
            "hard_start": 10,
            "loss_of_power": 10,
            "warning_light": 5,
        },

        "context_weights": {
            "previous_ignition_issue": 10,
        },

        "severity": "medium",

        "description": {
            "en": (
                "A worn spark plug or faulty ignition coil can cause "
                "misfires, engine vibration, hesitation, difficult "
                "starting, and reduced engine performance."
            ),
            "ro": (
                "O bujie uzată sau o bobină de inducție defectă poate "
                "provoca rateuri, vibrații ale motorului, ezitare, "
                "pornire dificilă și reducerea performanței."
            ),
        },

        "recommended_checks": {
            "en": [
                "Read cylinder-specific misfire and ignition-coil DTCs",
                "Inspect spark plug condition and gap",
                "Check ignition coil connectors and wiring",
                "Swap ignition coils between cylinders when appropriate to verify the fault",
            ],
            "ro": [
                "Verifică codurile DTC specifice cilindrilor și bobinelor de inducție",
                "Verifică starea și distanța electrozilor bujiilor",
                "Verifică firele și conectorii bobinelor",
                "Dacă este potrivit, schimbă bobinele între cilindri pentru a verifica dacă defectul se mută",
            ],
        },
    },

    # =========================================================
    # TRANSMISSION / DRIVELINE
    # =========================================================

    {
        "rule_id": "KB-020",
        "probable_cause": {
            "en": "Transmission or driveline operating fault",
            "ro": "Problemă de funcționare a transmisiei sau trenului de rulare",
        },
        "base_score": 10,
        "symptom_weights": {},
        "dtc_weights": {},
        "adaptive_weights": {},
        "text_evidence_weights": {
            "transmission_issue": 45,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Abnormal gear engagement, slipping, delayed engagement, "
                "or jerking during gear changes may indicate a transmission "
                "or driveline operating problem."
            ),
            "ro": (
                "Cuplarea anormală a treptelor, patinarea, întârzierea la "
                "cuplare sau șocurile la schimbarea treptelor pot indica o "
                "problemă de funcționare a transmisiei sau trenului de rulare."
            ),
        },
        "recommended_checks": {
            "en": [
                "Scan the transmission or driveline control modules for stored fault codes",
                "Check transmission-fluid level and condition where applicable",
                "Inspect electrical connectors and wiring related to transmission control",
                "Compare commanded and actual gear or clutch data where diagnostic data is available",
            ],
            "ro": [
                "Scanează modulele transmisiei sau trenului de rulare pentru coduri de eroare",
                "Verifică nivelul și starea uleiului de transmisie unde este cazul",
                "Verifică firele și conectorii sistemului de control al transmisiei",
                "Compară treapta sau ambreiajul comandat cu valorile reale dacă sunt disponibile date de diagnostic",
            ],
        },
    },

    # =========================================================
    # ELECTRICAL SYSTEM
    # =========================================================

    {
        "rule_id": "KB-021",
        "probable_cause": {
            "en": "Vehicle electrical-system fault",
            "ro": "Problemă la sistemul electric al vehiculului",
        },
        "base_score": 10,
        "symptom_weights": {},
        "dtc_weights": {
            "P0562": 30,
        },
        "adaptive_weights": {},
        "text_evidence_weights": {
            "electrical_issue": 45,
            "warning_light": 5,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Flickering lights, displays switching off, or electrical "
                "accessories behaving abnormally may indicate a power-supply, "
                "ground, wiring, charging, or electronic-control issue."
            ),
            "ro": (
                "Pâlpâirea luminilor, oprirea display-urilor sau funcționarea "
                "anormală a consumatorilor electrici poate indica o problemă "
                "de alimentare, masă, cablaj, încărcare sau control electronic."
            ),
        },
        "recommended_checks": {
            "en": [
                "Check 12 V battery voltage and condition",
                "Inspect battery terminals and major ground connections",
                "Check charging-system voltage where applicable",
                "Scan relevant control modules for undervoltage or communication faults",
            ],
            "ro": [
                "Verifică tensiunea și starea bateriei de 12 V",
                "Verifică bornele bateriei și conexiunile principale de masă",
                "Verifică tensiunea sistemului de încărcare unde este cazul",
                "Scanează modulele relevante pentru erori de subtensiune sau comunicație",
            ],
        },
    },

    # =========================================================
    # SUSPENSION
    # =========================================================

    {
        "rule_id": "KB-022",
        "probable_cause": {
            "en": "Suspension-system or chassis component fault",
            "ro": "Problemă la suspensie sau la o componentă a șasiului",
        },
        "base_score": 10,
        "symptom_weights": {},
        "dtc_weights": {},
        "adaptive_weights": {},
        "text_evidence_weights": {
            "suspension_issue": 45,
            "unusual_noise": 10,
        },
        "severity": "medium",
        "description": {
            "en": (
                "Knocking over bumps, excessive bouncing, or other abnormal "
                "suspension behavior may indicate wear, looseness, or damage "
                "in suspension or chassis components."
            ),
            "ro": (
                "Bătăile peste denivelări, balansul excesiv sau alt comportament "
                "anormal al suspensiei poate indica uzură, joc sau deteriorare "
                "la componente ale suspensiei sau șasiului."
            ),
        },
        "recommended_checks": {
            "en": [
                "Inspect suspension joints, bushings, and links for play or damage",
                "Check shock absorbers or struts for leakage and abnormal movement",
                "Inspect springs and mounting points",
                "Check wheel and tire condition before replacing suspension components",
            ],
            "ro": [
                "Verifică articulațiile, bucșele și bieletele pentru joc sau deteriorări",
                "Verifică amortizoarele pentru pierderi și funcționare anormală",
                "Verifică arcurile și punctele de prindere",
                "Verifică starea roților și anvelopelor înainte de înlocuirea componentelor suspensiei",
            ],
        },
    },

    # =========================================================
    # FLUID LEAK
    # =========================================================

    {
        "rule_id": "KB-023",
        "probable_cause": {
            "en": "Vehicle fluid leak requiring source identification",
            "ro": "Pierdere de lichid care necesită identificarea sursei",
        },
        "base_score": 10,
        "symptom_weights": {},
        "dtc_weights": {},
        "adaptive_weights": {},
        "text_evidence_weights": {
            "fluid_leak": 50,
        },
        "severity": "medium",
                "urgency": "service_soon",
        "safety_message": {
            "en": "Identify the leaking fluid as soon as possible. If it may be fuel or brake fluid, or the fluid level is dropping rapidly, do not continue driving.",
            "ro": "Identifică sursa lichidului cât mai curând. Dacă poate fi combustibil sau lichid de frână, ori nivelul scade rapid, nu continua deplasarea.",
        },
"description": {
            "en": (
                "Visible fluid under the vehicle can originate from several "
                "systems. The fluid type and exact source must be identified "
                "before a component-level conclusion is made."
            ),
            "ro": (
                "Lichidul observat sub vehicul poate proveni din mai multe "
                "sisteme. Tipul lichidului și sursa exactă trebuie identificate "
                "înainte de stabilirea unei cauze la nivel de componentă."
            ),
        },
        "recommended_checks": {
            "en": [
                "Identify the fluid by color, smell, location, and consistency without touching unknown hazardous fluids",
                "Check engine oil, coolant, brake fluid, transmission fluid, and washer-fluid levels where applicable",
                "Inspect the area above the visible leak because fluid can travel before dripping",
                "Do not continue driving if the leak is fuel, brake fluid, or is causing rapid fluid loss",
            ],
            "ro": [
                "Identifică lichidul după culoare, miros, poziție și consistență fără a atinge lichide necunoscute sau periculoase",
                "Verifică nivelurile de ulei, lichid de răcire, lichid de frână, ulei de transmisie și lichid de parbriz unde este cazul",
                "Verifică zona de deasupra locului unde picură deoarece lichidul se poate deplasa înainte de a ajunge pe sol",
                "Nu continua deplasarea dacă pierderea este de combustibil, lichid de frână sau provoacă scăderea rapidă a unui nivel",
            ],
        },
    },

    # =========================================================
    # HVAC
    # =========================================================

    {
        "rule_id": "KB-024",
        "probable_cause": {
            "en": "Heating, ventilation, or air-conditioning system fault",
            "ro": "Problemă la sistemul de încălzire, ventilație sau climatizare",
        },
        "base_score": 10,
        "symptom_weights": {},
        "dtc_weights": {},
        "adaptive_weights": {},
        "text_evidence_weights": {
            "hvac_issue": 50,
        },
        "severity": "low",
        "description": {
            "en": (
                "Poor cabin heating, ventilation, or air-conditioning "
                "performance may originate from the HVAC electrical, airflow, "
                "refrigerant, actuator, or thermal-management system."
            ),
            "ro": (
                "Funcționarea slabă a încălzirii, ventilației sau aerului "
                "condiționat poate proveni din sistemul electric HVAC, debitul "
                "de aer, agentul frigorific, actuatoare sau managementul termic."
            ),
        },
        "recommended_checks": {
            "en": [
                "Check whether the cabin blower operates at all commanded speeds",
                "Inspect HVAC-related fuses and stored fault codes where available",
                "Check air temperature from the vents in different HVAC modes",
                "Inspect refrigerant-system pressures only with appropriate equipment and training",
            ],
            "ro": [
                "Verifică dacă ventilatorul habitaclului funcționează la toate treptele comandate",
                "Verifică siguranțele și codurile de eroare asociate sistemului HVAC unde sunt disponibile",
                "Verifică temperatura aerului la gurile de ventilație în diferite moduri HVAC",
                "Verifică presiunile instalației frigorifice doar cu echipament și pregătire corespunzătoare",
            ],
        },
    },
]