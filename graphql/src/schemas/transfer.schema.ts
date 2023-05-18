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
export class BalanceValue {

  @Field(() => Number)
  amount: number;
}

@ObjectType()
export class Balance {
  @Field(() => String)
  status: string;

  @Field(() => String)
  message: string;

  @Field(() => BalanceValue)
  balance: BalanceValue;
}

@InputType()
export class TransferFundsInput {

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