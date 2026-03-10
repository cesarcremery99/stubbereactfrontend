import { useState, ReactElement, FormEvent } from 'react'

interface LoginPageProps {
  onSubmit: (credentials: { email: string; password: string }) => void
}

function LoginPage({ onSubmit }: LoginPageProps): ReactElement {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onSubmit({ email: email.trim(), password })
  }

  return (
    <section className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
      <header className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Login</h1>
      </header>

      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <label htmlFor="email" className="font-semibold mt-2 text-gray-900 dark:text-white text-sm">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2.5 transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />

        <label htmlFor="password" className="font-semibold mt-2 text-gray-900 dark:text-white text-sm">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2.5 transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />

        <button type="submit" className="px-4 py-2.5 rounded-md font-semibold cursor-pointer transition-all duration-200 border-none text-sm w-full bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
          Login
        </button>
      </form>
    </section>
  )
}

export default LoginPage
