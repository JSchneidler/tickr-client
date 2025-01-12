import TickrLogo from "./assets/tickr-logo-red.svg";

export default function Construction() {
  return (
    <div className="flex flex-col grow justify-center items-center h-fit drop-shadow-lg">
      <img className="max-w-64" src={TickrLogo} />
      <h1 className="text-3xl text-center mt-4">
        Welcome to Tickr! We are currently under construction.
      </h1>
    </div>
  );
}
