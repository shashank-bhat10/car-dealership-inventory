const API_BASE_URL = 'http://127.0.0.1:8000'

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('access_token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  )

  const data = await response
    .json()
    .catch(() => null)

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'

    if (typeof data?.detail === 'string') {
      message = data.detail
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((error) => {
          if (typeof error === 'string') {
            return error
          }

          return error.msg || JSON.stringify(error)
        })
        .join(', ')
    } else if (typeof data?.message === 'string') {
      message = data.message
    }

    throw new Error(message)
  }

  return data
}

export const registerUser = async (userData) => {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const loginUser = async (credentials) => {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export const getCurrentUser = async () => {
  return request('/api/auth/me')
}