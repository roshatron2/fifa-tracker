import { Network, Table } from 'lucide-react';

export function TrophyIcon({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Trophy Base */}
      <rect
        x="20"
        y="48"
        width="24"
        height="4"
        fill="url(#goldGradient)"
        rx="1"
      />

      {/* Trophy Stem */}
      <rect x="28" y="40" width="8" height="8" fill="url(#goldGradient)" />

      {/* Trophy Cup Left Handle */}
      <path
        d="M 20 32 Q 12 32 12 24 Q 12 20 16 20"
        stroke="url(#goldGradient)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Trophy Cup Right Handle */}
      <path
        d="M 44 32 Q 52 32 52 24 Q 52 20 48 20"
        stroke="url(#goldGradient)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Trophy Cup Main Body */}
      <path
        d="M 20 32 L 18 20 Q 18 16 22 16 L 42 16 Q 46 16 46 20 L 44 32"
        fill="url(#goldGradient)"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
      />

      {/* Football/Soccer Ball - Positioned in Trophy Cup */}
      <circle
        cx="32"
        cy="24"
        r="10"
        fill="url(#ballGradient)"
        stroke="#1e293b"
        strokeWidth="1.5"
      />

      {/* Ball Pentagon Pattern */}
      <g stroke="#1e293b" strokeWidth="1" fill="none" opacity="0.6">
        {/* Top pentagon */}
        <path d="M 32 16 L 36 18 L 35 23 L 29 23 L 28 18 Z" />
        {/* Bottom hexagon */}
        <path d="M 28 25 L 32 27 L 36 25 L 36 31 L 32 33 L 28 31 Z" />
      </g>

      {/* Shine/Highlight on Ball */}
      <circle cx="29" cy="20" r="2" fill="white" opacity="0.4" />

      {/* Shine on Trophy */}
      <ellipse cx="26" cy="22" rx="3" ry="5" fill="white" opacity="0.3" />

      {/* Gradients */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const FootballIcon = ({
  className = 'w-6 h-6',
}: {
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
    fill="currentColor"
  >
    <path d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 32c105.9 0 192 86.1 192 192S361.9 448 256 448 64 361.9 64 256 150.1 64 256 64z" />
    <path d="M256 144l-56 40 21 64h70l21-64-56-40zm-112 72l-48 40 40 48 56-16-16-56-32-16zm224 0l-32 16-16 56 56 16 40-48-48-40zm-112 104c-26.5 0-48 21.5-48 48 0 15.7 7.7 29.7 19.6 38.4 5.3 3.9 11.6 5.6 18.4 5.6s13.1-1.7 18.4-5.6c11.9-8.7 19.6-22.7 19.6-38.4 0-26.5-21.5-48-48-48z" />
  </svg>
);

export const CalendarIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zM3 6v11h14V6H3z"
      clipRule="evenodd"
    />
  </svg>
);

export const PlusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const SettingsIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.93 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

export const ChevronDownIcon = ({
  className = 'w-4 h-4',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const UserIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

export const Bars3Icon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      clipRule="evenodd"
    />
  </svg>
);

export const ArrowLeftIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const ExclamationTriangleIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const PencilIcon = ({
  className = 'w-4 h-4',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

export const TrashIcon = ({
  className = 'w-4 h-4',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const UserPlusIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M8 10a3 3 0 100-6 3 3 0 000 6zM8 12a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
  </svg>
);

export const ChartBarIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

export const WinIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export const LossIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

export const DrawIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

export const TableIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => <Table className={className} />;

export const HierarchyIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}) => <Network className={className} />;
