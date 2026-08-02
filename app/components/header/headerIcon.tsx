import { headerIconsConfig } from "@/config/headerIcons.config";

export default function HeaderIcons() {
  return (
    <div className="center gap-4">
      {headerIconsConfig.map((item) => (
        <span key={item.label}>{item.icon}</span>
      ))}
    </div>
  );
}
