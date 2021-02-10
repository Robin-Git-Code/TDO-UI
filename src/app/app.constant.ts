export const staticLists = {
    formatList: [
        { key: 'Match' }, { key: 'General Date' }, { key: 'Long Date' }, { key: 'Medium Date' }, { key: 'Short Date' },
        { key: 'Long Time' }, { key: 'Medium Time' }, { key: 'Short Time' }, { key: 'General Number' }, { key: 'Currency' },
        { key: 'Euro' }, { key: 'Fixed' }, { key: 'Standard' }, { key: 'Percent' }, { key: 'Scientific' },
        { key: 'Yes/No' }, { key: 'True/False' }, { key: 'On/Off' }, { key: '###-##-####' }, { key: '(###) ###-####' },
        { key: 'EmailOnly' }
    ],
    pictureList: [
        { key: 'Custom Picture', value: 'PICKPICTURE ', image: 'assets/images/letters/placeholder/PickPicture.jpg' },
        { key: 'Collage', value: 'COLLAGE', image: 'assets/images/letters/placeholder/collage.png' },
        { key: 'Patient Picture', value: 'PATIENTPICTURE', image: 'assets/images/letters/placeholder/PatientPicture.jpg' },
        { key: 'Recall Picture', value: 'RECALL', image: 'assets/images/letters/placeholder/Recall.jpg' },
        { key: 'Pre-op1', value: 'PREOP1', image: 'assets/images/letters/placeholder/Pre-op1.jpg' },
        { key: 'Pre-op2', value: 'PREOP2', image: 'assets/images/letters/placeholder/Pre-Op2.jpg' },
        { key: 'Post-op1', value: 'POSTOP1', image: 'assets/images/letters/placeholder/Post-op1.jpg' },
        { key: 'Post-op2', value: 'POSTOP2', image: 'assets/images/letters/placeholder/Post-Op2.jpg' },
        { key: 'Interim Picture', value: 'INTERIM', image: 'assets/images/letters/placeholder/Interim.jpg' },
        { key: 'Clinical*1', value: 'CLINICAL1', image: 'assets/images/letters/placeholder/clinical1.png' },
        { key: 'Clinical*2', value: 'CLINICAL2', image: 'assets/images/letters/placeholder/clinical2.png' },
        { key: 'Clinical*3', value: 'CLINICAL3', image: 'assets/images/letters/placeholder/clinical3.png' },
        { key: 'Clinical*4', value: 'CLINICAL4', image: 'assets/images/letters/placeholder/clinical4.png' },
        { key: 'Clinical*5', value: 'CLINICAL5', image: 'assets/images/letters/placeholder/clinical5.png' },
        { key: 'Clinical*6', value: 'CLINICAL6', image: 'assets/images/letters/placeholder/clinical6.png' }
    ],
    cbctList: [{ "ID": 1, "VolumeName": "VOL_1", "CBCTDate": "7/23/2020", "TakenBy": "endo" }, { "ID": 2, "VolumeName": "VOL_3", "CBCTDate": "7/27/2020", "TakenBy": "endo" }],
    categoryList: [{ "ID": 1, "catName": "Billings" }, { "ID": 2, "catName": "Collected" }, { "ID": 3, "catName": "Cases" }, { "ID": 4, "catName": "Avg DI" }, { "ID": 5, "catName": "Avg PI" }, { "ID": 6, "catName": "% Failed Appts" }, { "ID": 7, "catName": "% Emerg Appts" }, { "ID": 8, "catName": "% No Procedure" }],
    reportList: [
        // “”,value :Null },
        { key: 'Referral', value: 1 },
        { key: 'Recall', value: 2 },
        { key: 'Diagnostic', value: 3 },
        { key: 'Patient Web Registration', value: 4 },
        { key: 'CBCT', value: 5 }
    ]
};

export const pictureListData = {
    imageSize: [
        { ID: 1, SIZE: '64 X 64', val: '64px' },
        { ID: 2, SIZE: '80 X 80', val: '80px' },
        { ID: 3, SIZE: '96 X 96', val: '96px' },
        { ID: 4, SIZE: '115 X 115', val: '115px' },
        { ID: 5, SIZE: '128 X 128', val: '128px' },
        { ID: 6, SIZE: '150 X 150', val: '150px' },
        { ID: 7, SIZE: '175 X 175', val: '175px' },
        { ID: 8, SIZE: '200 X 200', val: '200px' }
    ],
    filterBy: [
        { ID: 1, Text: 'Tooth' },
        { ID: 2, Text: 'Category' },
        { ID: 3, Text: 'Reference Date' },
        { ID: 4, Text: 'Recall Date' },
        { ID: 5, Text: 'Image Date' }
    ]
};

export const picNotesData = {
    Administrative: [
        { ID: 1, Text: 'Show' },
        { ID: 2, Text: 'Hide' },
        { ID: 3, Text: 'Only' }
    ],
    ToothPat: [
        { ID: 1, Text: 'All' },
        { ID: 2, Text: 'Both' },
        { ID: 3, Text: 'Patient' },
        { ID: 4, Text: 'Tooth' }
    ],
    Private: [
        { ID: 1, Text: 'Show' },
        { ID: 2, Text: 'Hide' },
        { ID: 3, Text: 'Only' }
    ],
    Hidden: [
        { ID: 1, Text: 'Show' },
        { ID: 2, Text: 'Hide' },
        { ID: 3, Text: 'Only' }
    ],
    Teeth: [
        { ID: 1, Text: 'All' },
        { ID: 2, Text: 'Current Tooth' }
    ]
};