import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User, RegisterUserInput } from "../schemas/auth.schema";

@Resolver((of) => User)
export default class {
  @Query((returns) => User, { nullable: true })
  getUserByEmail(@Arg("email") email: string) {
    // return projects.find((project) => project.name === name);
  }

  @Mutation((returns) => User)
  register(@Arg("input") input: RegisterUserInput) {
    // return projects.find((project) => project.name === name);
    console.log(input.email, "graphql input");
    var raw = JSON.stringify({
    //   email: input.email,
    //   password: input.password,
    //   username: input.username,
    ...input
    });console.log(raw, "raw body");

    var requestOptions = {
      method: "POST",
      body: JSON.stringify({...input}),
      //   redirect: "follow",
    };
    const user = fetch(
      "http://localhost:5005/api/auth/register",
      //   requestOptions
      {
        method: "POST",
        body: raw,
      }
    )
      .then(async (response) => {
        let val = await response.text();
        console.log(val);
        let data: User = await response.json();
        console.log(data);
        return {
          username: data.username,
          email: data.email,
          password: data.password,
          balance: 9000,
        };
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
}
