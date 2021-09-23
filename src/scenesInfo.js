let categories = new Map();
categories.set('hub', {
    name: 'hub',
    color: 'gray',
    whitelisted: true
});
categories.set('hub_formation', {
    name: 'hub_formation',
    color: 'darkgray',
    whitelisted: true
});
categories.set('couloir_formation', {
    name: 'couloir_formation',
    color: 'orange',
    whitelisted: true
});
categories.set('chambre_formation', {
    name: 'chambre_formation',
    color: 'red',
    whitelisted: true
});
categories.set('couloir_entrainement', {
    name: 'couloir_entrainement',
    color: 'cyan',
    whitelisted: true
});
categories.set('chambre_entrainement', {
    name: 'chambre_entrainement',
    color: 'blue',
    whitelisted: true
});

let themes = new Map();
themes.set('neutre', {
    color: 'gray'
})

themes.set('gestion_mortuaire', {
    color: 'red'
})

themes.set('gestes_a_adopter', {
    color: 'blue'
})

export const themesInfo = themes;
export const categoriesInfo = categories;

export const scenesInfo = [
    {
        id: 'Start_Experience',
        name: 'Start_Experience',
        category: 'hub',
        theme: 'neutre',
        whitelisted: false,
    },
    {
        id: "StartExperience",
        name: "StartExperience",
        category: 'hub',
        theme: 'neutre',
        whitelisted: false,
    }, {
        id: "Couloir",
        name: "Couloir",
        category: 'hub',
        theme: 'neutre',
        whitelisted: false,
    }, {
        id: "Couloir_1",
        name: "Couloir_1",
        category: 'hub',
        theme: 'neutre',
        whitelisted: false,
    }, {
        id: "scene_1",
        name: "scene_1",
        category: 'hub',
        theme: 'neutre',
        whitelisted: false,
    }, {
        id: "Couloir_Formation",
        name: "Couloir_Formation",
        category: 'couloir_formation',
        theme: 'neutre',
        whitelisted: true,
    }, {
        id: "Couloir_Formation_Gestes_a_adopter",
        name: "Couloir_Formation_Gestes_a_adopter",
        category: 'couloir_formation',
        theme: 'gestes_a_adopter',
        whitelisted: false,
    }, {
        id: "Couloir_Formation_Gestion_mortuaire",
        name: "Couloir_Formation_Gestion_mortuaire",
        category: 'couloir_formation',
        theme: 'gestion_mortuaire',
        whitelisted: false,
    }, {
        id: "Couloir_Formation_Gestes_en_chambre",
        name: "Couloir_Formation_Gestes_en_chambre",
        category: 'couloir_formation',
        theme: 'gestes_a_adopter',
        whitelisted: false,
    }, {
        id: "Couloir_Evaluation",
        name: "Couloir_Evaluation",
        category: 'couloir_entrainement',
        theme: 'neutre',
        whitelisted: true,
    }, {
        id: "Couloir_Evaluation_Gestes_a_adopter_v1_v2",
        name: "Couloir_Evaluation_Gestes_a_adopter_v1_v2",
        category: 'couloir_entrainement',
        theme: 'gestes_a_adopter',
        whitelisted: false,
    }, {
        id: "Couloir_Evaluation_Gestes_a_adopter_v1",
        name: "Couloir_Evaluation_Gestes_a_adopter_v1",
        category: 'couloir_entrainement',
        theme: 'gestes_a_adopter',
        whitelisted: false,
    }, {
        id: "Couloir_Evaluation_Gestes_a_adopter_v2",
        name: "Couloir_Evaluation_Gestes_a_adopter_v2",
        category: 'couloir_entrainement',
        theme: 'gestes_a_adopter',
        whitelisted: false,
    }, {
        id: "Couloir_Evaluation_Gestion_mortuaire_v1_v2",
        name: "Couloir_Evaluation_Gestion_mortuaire_v1_v2",
        category: 'couloir_entrainement',
        theme: 'gestion_mortuaire',
        whitelisted: false,
    }, {
        id: "Couloir_Evaluation_Gestion_mortuaire_v1",
        name: "Couloir_Evaluation_Gestion_mortuaire_v1",
        category: 'couloir_entrainement',
        theme: 'gestion_mortuaire',
        whitelisted: false,
    }, {
        id: "Couloir_Evaluation_Gestion_mortuaire_v2",
        name: "Couloir_Evaluation_Gestion_mortuaire_v2",
        category: 'couloir_entrainement',
        theme: 'gestion_mortuaire',
        whitelisted: false,
    }, {
        id: "Chambre_Formation_Gestes_a_adopter",
        name: "Chambre_Formation_Gestes_a_adopter",
        category: 'hub_formation',
        theme: 'gestes_a_adopter',
        whitelisted: false,
    }, {
        id: "Chambre_Formation_Gestion_mortuaire",
        name: "Chambre_Formation_Gestion_mortuaire",
        category: 'hub_formation',
        theme: 'gestion_mortuaire',
        whitelisted: false,
    }, {
        id: "Video_gestion_oxygene",
        name: "Video_gestion_oxygene",
        category: 'chambre_formation',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Video_gestion_du_corps",
        name: "Video_gestion_du_corps",
        category: 'chambre_formation',
        theme: 'gestion_mortuaire',
        whitelisted: true,
    }, {
        id: "Video_gestion_des_dechets",
        name: "Video_gestion_des_dechets",
        category: 'chambre_formation',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Video_entretien",
        name: "Video_entretien",
        category: 'chambre_formation',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Video_gestion_des_excretas",
        name: "Video_gestion_des_excretas",
        category: 'chambre_formation',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Video_gestion_des_plateaux_repas",
        name: "Video_gestion_des_plateaux_repas",
        category: 'chambre_formation',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Video_gestion_linge",
        name: "Video_gestion_linge",
        category: 'chambre_formation',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Video_gestion_materiel_de_soin",
        name: "Video_gestion_materiel_de_soin",
        theme: 'gestes_a_adopter',
        category: 'chambre_formation',
        whitelisted: true,
    }, {
        id: "Video_gestion_des_effets_perso",
        name: "Video_gestion_des_effets_perso",
        category: 'chambre_formation',
        theme: 'gestion_mortuaire',
        whitelisted: true,
    }, {
        id: "Chambre_des_erreurs_Gestes_a_adopter_v1",
        name: "Chambre_des_erreurs_Gestes_a_adopter_v1",
        category: 'chambre_entrainement',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Chambre_des_erreurs_Gestes_a_adopter_v2",
        name: "Chambre_des_erreurs_Gestes_a_adopter_v2",
        category: 'chambre_entrainement',
        theme: 'gestes_a_adopter',
        whitelisted: true,
    }, {
        id: "Chambre_des_erreurs_Gestion_mortuaire_v1",
        name: "Chambre_des_erreurs_Gestion_mortuaire_v1",
        category: 'chambre_entrainement',
        theme: 'gestion_mortuaire',
        whitelisted: true,
    }, {
        id: "Chambre_des_erreurs_Gestion_mortuaire_v2",
        name: "Chambre_des_erreurs_Gestion_mortuaire_v2",
        category: 'chambre_entrainement',
        theme: 'gestion_mortuaire',
        whitelisted: true,
    },
]