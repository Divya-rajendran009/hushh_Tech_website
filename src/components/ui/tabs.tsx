import React, { useState, ReactNode } from 'react';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

interface TabsListProps {
  children: ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
}

const CONTROL_GROUP_CLASSES = "flex flex-wrap items-center gap-2";

const TRIGGER_BASE_CLASSES = [
  "inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2",
  "text-sm font-semibold transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
].join(" ");

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child: any) =>
        child.type === TabsList
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child.type === TabsContent && child.props.value === activeTab
          ? child
          : null
      )}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({
  children,
  activeTab,
  setActiveTab,
  className = "",
}) => (
  <div className={`${CONTROL_GROUP_CLASSES} ${className}`}>
    {React.Children.map(children, (child: any) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

export const TabsTrigger: React.FC<TabsTriggerProps & { activeTab?: string; setActiveTab?: (value: string) => void }> = ({
  value,
  children,
  activeTab,
  setActiveTab,
  className = "",
}) => (
  <button
    type="button"
    onClick={() => setActiveTab?.(value)}
    className={`${TRIGGER_BASE_CLASSES} ${activeTab === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'} ${className}`}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => <div>{children}</div>;
