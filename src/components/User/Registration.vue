<template>
	<v-main>
		<v-container fluid fill-height>
			<v-layout align-center justify-center>
				<v-flex xs12 sm8 md4>
					<v-card class="elevation-12">
						<v-toolbar color="primary" dark flat>
							<v-toolbar-title>Регистрация</v-toolbar-title>
						</v-toolbar>
						<v-card-text>
							<v-form v-model="valid" ref="form" validation>
								<v-text-field
									label="Эл. почта"
									name="login"
									prepend-icon="mdi-account"
									type="text"
									v-model="email"
									:rules="emailRules"
								></v-text-field>

								<v-text-field
									id="password"
									label="Пароль"
									name="password"
									prepend-icon="mdi-key"
									type="password"
									v-model="password"
									:counter="8"
									:rules="passwordRules"
								></v-text-field>

								<v-text-field
									id="confirmPassword"
									label="Подтверждение пароля"
									name="confirmPassword"
									prepend-icon="mdi-key"
									type="password"
								></v-text-field>
							</v-form>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="primary"
								@click="onSubmit"
								:loading="loading"
								:disabled="!valid || loading"
								>Регистрация</v-btn
							>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-main>
</template>

<script>
export default {
	data: () => ({
		valid: false,
		email: "",
		password: "",
		confirmPassword: "",
		emailRules: [
			(v) => !!v || "Требуется электронная почта",
			(v) => /.+@.+/.test(v) || "Эл. почта должена быть действительной",
		],
		passwordRules: [
			(v) => !!v || "Требуется пароль",
			(v) => (v && v.length >= 8) || "Пароль должен быть больше 8 символов",
		],
		confirmPasswordRules: [
			(v) => !!v || "Требуется пароль",
			(v) => v === this.password || "Пароли должны совпадать",
		],
	}),
	computed: {
		loading() {
			return this.$store.getters.loading;
		},
	},
	methods: {
		onSubmit() {
			if (this.$refs.form.validate()) {
				const user = {
					email: this.email,
					password: this.password,
				};
				this.$store
					.dispatch("registerUser", user)
					.then(() => {
						this.$router.push("/CreateProfile");
					})
					.catch((err) => {
						this.$store.dispatch("setError", err.message);
					});
			}
		},
	},
};
</script>