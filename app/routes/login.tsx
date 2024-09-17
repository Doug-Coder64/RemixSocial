import { ActionFunction, json } from "@remix-run/node";
import { login, register } from "~/utils/auth.server";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";

import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );

  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
};

export default function Login() {
  const [action, setAction] = useState("login");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className='flex h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-16'>
          <h2 className='text-gray-800 dark:text-gray-100 font-extrabold text-5xl'>
            Login
          </h2>

          <form
            method='POST'
            className='flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700'
          >
            <FormField
              htmlFor='email'
              label='Email'
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
            />

            {action === "register" && (
              <>
                <FormField
                  htmlFor='firstName'
                  label='First Name'
                  onChange={(e) => handleInputChange(e, "firstName")}
                  value={formData.firstName}
                />
                <FormField
                  htmlFor='lastName'
                  label='Last Name'
                  onChange={(e) => handleInputChange(e, "lastName")}
                  value={formData.firstName}
                />
              </>
            )}

            <FormField
              htmlFor='password'
              type='password'
              label='Password'
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
            />

            <div className='w-full text-center'>
              <button
                type='submit'
                name='_action'
                className='rounded-xl mt-2  px-3 py-2 text-gray-800 dark:text-gray-100 font-semibold transition duration-300 ease-in-out hover:-translate-y-1'
                value={action}
              >
                {action === "login" ? "Login" : "Register"}
              </button>
            </div>
          </form>
          <button
            onClick={() => setAction(action == "login" ? "register" : "login")}
          >
            {action === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
