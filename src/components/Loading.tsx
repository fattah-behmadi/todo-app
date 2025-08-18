import { Spinner } from "./base";

export function Loading() {
  return (
    <div className="flex justify-center items-center py-12">
      <Spinner size="lg" />
    </div>
  );
}
