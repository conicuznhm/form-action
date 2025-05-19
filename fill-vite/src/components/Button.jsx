export default function Button({onClick, disabled}) {
    return (
        <button
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
          onClick={onClick}
          disabled={disabled}
        >

        </button>
    );
};