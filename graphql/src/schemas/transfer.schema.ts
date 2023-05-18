import { Field, InputType, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Transfer {
  @Field(() => String)
  sender: string;

  @Field(() => String)
  recipient: string;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  date: string;
}

@ObjectType()
export class Balance {
  @Field(() => Number)
  balance: number;
}

@InputType()
export class TransferFundsInput {
  @Field(() => String)
  sender: string;

  @Field(() => String)
  recipient: string;

  @Field(() => Number)
  amount: number;
}

@InputType()
export class ViewTransactionsInput {
  @Field(() => String)
  user: string;
}