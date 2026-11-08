import { InjectionToken, inject } from "@angular/core";
import type { EditPayment, Loans, NewPayment } from "@app/models";
import { ApiCallsService } from "@app/services";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { withEntities } from "@ngrx/signals/entities";
import { firstValueFrom } from "rxjs";
import { addNewPayment, calculatePaymentDifference, updateSpecificPayment } from "./loans.utils";

type LoansState = {
  loans: Loans[];
};

const initialState: LoansState = {
  loans: [],
};

const LOANS_STATE = new InjectionToken<LoansState>("LoansState", {
  factory: () => initialState,
});

export const LoansStore = signalStore(
  { providedIn: "root" },
  withState(() => inject(LOANS_STATE)),
  withEntities<LoansState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearLoans(): void {
      patchState(store, { loans: initialState.loans });
    },

    async updateLoans(): Promise<void> {
      const loans = await firstValueFrom(apiCallsService.getLoans());
      patchState(store, { loans });
    },

    addLoan(newLoan: Loans): void {
      patchState(store, {
        loans: [newLoan, ...store.loans()],
      });
    },

    updatePayment(editPayment: EditPayment): void {
      patchState(store, {
        loans: store.loans().map((loan) => {
          if (loan.id !== editPayment.loanId) return loan;

          const originalPayment = loan.lastFivePayments.find(
            (payment) => payment.id === editPayment.paymentId,
          );

          if (!originalPayment) return loan;

          const difference = calculatePaymentDifference(originalPayment.amount, editPayment.amount);
          const totalPaid = loan.totalPaid + difference;

          return {
            ...loan,
            lastFivePayments: updateSpecificPayment(loan.lastFivePayments, editPayment),
            totalPaid,
            remaining: Math.max(0, loan.principal - totalPaid),
          };
        }),
      });
    },

    addPayment(newPayment: NewPayment): void {
      patchState(store, {
        loans: store.loans().map((loan) => {
          if (loan.id !== newPayment.loanId) return loan;

          const totalPaid = loan.totalPaid + newPayment.amount;

          return {
            ...loan,
            lastFivePayments: addNewPayment(loan.lastFivePayments, newPayment),
            totalPaid,
            remaining: Math.max(0, loan.principal - totalPaid),
          };
        }),
      });
    },
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const loans = await firstValueFrom(apiCallsService.getLoans());
        patchState(store, { loans });
      } catch (error) {
        console.error("Error fetching Loans:", error);
        patchState(store, { loans: initialState.loans });
      }
    },
  }),
);
