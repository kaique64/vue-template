import { BaseEnum } from "../../type/BaseEnum";

export class PanelSizeEnum extends BaseEnum<PanelSizeEnum> {
  static readonly FULL = new PanelSizeEnum("FULL", "col-md-12 col-xs-12");
  static readonly HALF = new PanelSizeEnum("HALF", "col-md-6 col-xs-12");
  static readonly SEMI_HALF = new PanelSizeEnum(
    "SEMI_HALF",
    "col-md-5 col-xs-12"
  );
  static readonly ONE_THIRD = new PanelSizeEnum(
    "ONE_THIRD",
    "col-md-4 col-xs-12"
  );
  static readonly TWO_THIRD = new PanelSizeEnum(
    "TWO_THIRD",
    "col-md-8 col-xs-12"
  );

  _className: string;

  private constructor(
    public readonly key: string,
    public readonly className: string
  ) {
    super(key);
    this._className = className;
  }
}
