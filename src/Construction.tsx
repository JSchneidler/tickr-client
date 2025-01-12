import TickrLogo from "./assets/tickr-logo-red.svg";

export default function Construction() {
  return (
    <div className="flex h-fit grow flex-col items-center justify-center drop-shadow-lg">
      <img className="max-w-64" src={TickrLogo} />
      <h1 className="mt-4 text-center text-3xl">
        Welcome to Tickr! We are currently under construction.
      </h1>
    </div>
  );
}
