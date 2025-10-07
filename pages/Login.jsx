import React from "react"
import { 
   useLoaderData, 
   useLocation, 
   useNavigate, 
   Form, 
   redirect
} from "react-router-dom"
import { loginUser } from "../api"

export function loader({ request }) {
   return new URL(request.url).searchParams.get("message")
}

export async function action({ request }) {
   const formData = await request.formData()
   const email = formData.get("email")
   const password = formData.get("password")
   const data = await loginUser({ email, password})
   localStorage.setItem("loggedin", true)

   return redirect("/host")
}

export default function Login() {
   const [status, setStatus] = React.useState("idle")
   const [error, setError] = React.useState(null)
   const message = useLoaderData()
   const navigate = useNavigate()

   const location = useLocation()

   const from = location.state?.from || "/host"   

   function handleSubmit(e) {
      e.preventDefault()
      setStatus("submitting")
      setError(null)
      loginUser(loginFormData)
         .then(data => {
            localStorage.setItem("loggedin", true)
            navigate(from, { replace: true })
         })
         .catch(err => {
            setError(err)
         })
         .finally(() => {
            setStatus("idle")
         })
   }

   return (
      <div className="login-container">
         {
            location.state?.message &&
            <h3 className="login-error">{location.state.message}</h3>
         }
         {message && <h3 className="red">{message}</h3>}
         <h1>Sign in to your account</h1>
         {
            error?.message &&
            <h3 className="login-error">{error.message}</h3>
         }

         <Form 
            method="POST" 
            className="login-form"
            replace
         >
            <input
               name="email"
               type="email"
               placeholder="Email address"
            />
            <input
               name="password"
               type="password"
               placeholder="Password"
            />
            <button
               disabled={status === "submitting"}
            >
               {status === "submitting"
                  ? "Logging in..."
                  : "Log in"
               }
            </button>
         </Form>
      </div>
   )
}