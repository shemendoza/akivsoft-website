
export type ServiceAccent =
  | "blue"
  | "purple"
  | "cyan"
  | "pink"
  | "orange"
  | "gold"
  | "red"
  | "green"
  | "teal"
  | "indigo"
  | "violet"
  | "rose";

export type ServiceIconName =
  | "Gamepad2"
  | "Lightbulb"
  | "Gauge"
  | "Rocket"
  | "Smartphone"
  | "Globe"
  | "Sparkles"
  | "Code2"
  | "Braces"
  | "Terminal"
  | "Monitor"
  | "Laptop"
  | "Layers"
  | "Palette"
  | "PenTool"
  | "Activity"
  | "Blocks"
  | "Box"
  | "Bug"
  | "Cloud"
  | "Cpu"
  | "Database"
  | "FileCode2"
  | "Fingerprint"
  | "GitBranch"
  | "HardDrive"
  | "Joystick"
  | "LayoutDashboard"
  | "MousePointer2"
  | "Network"
  | "Puzzle"
  | "ShieldCheck"
  | "ShoppingCart"
  | "SlidersHorizontal"
  | "Target"
  | "Workflow"
  | "Wrench"
  | "Zap"
  | "Camera"
  | "Image"
  | "Music"
  | "Video"
  | "Wifi"
  | "Server"
  | "Lock";

export type ServiceSectionRecord = {
  id: string;
  title: string;
  description: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceRecord = {
  id: string;
  section_id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  tags: string[];
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicService = {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: ServiceIconName;
  accent: ServiceAccent;
};

export type PublicServiceSection = {
  id: string;
  title: string;
  description: string;
  services: PublicService[];
};
