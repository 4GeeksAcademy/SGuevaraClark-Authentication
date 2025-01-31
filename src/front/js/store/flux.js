const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			register: async(formData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/register', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(formData)
					})
					if (!resp.ok) throw new Error('Registration failed')
					const data = await resp.json()
					localStorage.setItem('token', data.token)
					return true
				} catch(error) {
					console.error(error)
					return false
				}
			},

			login: async(formData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(formData)
					})
					if (!resp.ok) throw new Error('Login failed')
					const data = await resp.json()
					localStorage.setItem('token', data.token)
					return true
				} catch(error) {
					console.error(error)
					return false
				}
			},

			checkUser: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/protected', {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					})
					if (!resp.ok || resp.status !== 200) throw new Error('Authentication failed')
					const data = await resp.json()
					setStore({user: data.user})
					return true
				} catch (error) {
					console.error(error)
					return false
				}
			},

			logout: () => {
				localStorage.removeItem('token')
				setStore({user: null})
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					return data
				} catch(error) {
					console.error("Error loading message from backend", error)
				}
			},

			changeColor: (index, color) => {
				const store = getStore()
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color
					return elm
				})
				setStore({ demo: demo })
			}
		}
	}
}

export default getState;