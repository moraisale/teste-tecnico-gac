import { IUser } from "./user";

export interface ITransaction {
  id: string;
  amount: number;
  type: string;
  fromUserId: string | null;
  toUserId: string | null;
  createdAt: string;
  reversed: boolean;
  originalTransactionId: string | null;
  fromUser: IUser | null;
  toUser: IUser | null;
}

export interface ITransactionItem {
  transaction: ITransaction,
  currentUserId: string,
  userName: string
}

export interface IRevertButtonProps {
  transactionId: string
  disabled?: boolean
}