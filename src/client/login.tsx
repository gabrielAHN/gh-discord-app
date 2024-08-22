import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "react-router-dom";

function Login() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-5">Railway Project 🚂</h1>
      <Form method="post" className="space-y-4">
        <Input type="text" name="username" placeholder="username" required />
        <Input type="text" name="password" placeholder="Password" required />
        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
}

export default Login;
