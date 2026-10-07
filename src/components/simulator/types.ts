export type IndustryId = "home" | "restaurant" | "salon" | "auto";
export type Variant = "before" | "after";

export type DemoProps = {
  variant: Variant;
  mobile: boolean;
  /** Called by any simulated control. Describes what the real site would do. */
  onAction: (description: string) => void;
};
