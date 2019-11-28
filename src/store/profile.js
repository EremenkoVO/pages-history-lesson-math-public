import * as fb from 'firebase';

class Profile {
    constructor (nameUser, secondName, ownerId, admin=0, id=null) {
        this.nameUser = nameUser;
        this.secondName = secondName;
        this.ownerId = ownerId;
        this.admin = admin;
        this.id = id;
    }
}

export default {
    state: {
        profile: []
    },
    mutations: {
        setProfile (state, payload) {
            state.profile.push(payload);
        },
        loadProfiles(state, payload) {
            state.profile = payload;
        },
        updateAd (state, {id, nameUser, secondName}) {
            const profile = state.profile.find(a => {
              return a.id === id;
            });

            profile.nameUser = nameUser;
            profile.secondName = secondName;
          }
    },
    actions: {
        // Заполнение профиля
        async setProfile({commit, getters}, payload) {
            commit('clearError');
            commit('setLoading', true);

            var admin = 0;

            try {
                const newProfile = new Profile (
                    payload.nameUser,
                    payload.secondName,
                    admin,
                    getters.user.id
                );

                const profile = fb.database().ref('profiles').push(newProfile);

                commit('setLoading', false);
                commit('setProfile', {
                    ...newProfile,
                    id: profile.key
                });

                commit('clearSuccess');
                commit('setSuccess', 'Профиль сохранен');
            }
            catch (error) {
                commit('setError', error.message);
                commit('setLoading', true);
                throw error;
            }
        },

        async updateProfile({commit}, {id, nameUser, secondName}) {
            commit('clearError');
            commit('setLoading', true);

            try {
                await fb.database().ref('profiles').child(id).update({
                    nameUser, 
                    secondName
                });

                commit('setLoading', false);
                commit('clearSuccess');
                commit('setSuccess', 'Профиль сохранен');
            }
            catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error;
            }
        },

        // Получение документов
        async fetchProfile({commit}) {
            commit('clearError');
            commit('setLoading', true);

            const resultProfile = [];

            try {
               const fbProfile = await fb.database().ref('profiles').once('value');
               const profiles = fbProfile.val();

               Object.keys(profiles).forEach(key => {
                   const profile = profiles[key];
                   resultProfile.push(
                       new Profile(profile.nameUser, profile.secondName, profile.ownerId, profile.admin, key)
                    );
               });

                commit('loadProfiles', resultProfile);
                commit('setLoading', false);
            }
            catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error;
            }
        }
    },
    getters: {
        profiles (state) {
            return state.profile;
        },

        profileById(state) {
            return profileId => {
                return state.profile.find(profile => profile.ownerId === profileId);
            };
        }
    }
};