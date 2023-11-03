import { uid } from 'quasar';

export class BaseEnum<T> {
  public readonly uuid: string;

  constructor() {
    // can be any uuid implementation
    this.uuid = uid();
  }

  static findByName(name: string): T {
    const resultArray = Object.entries(this)
      .filter((entryArray) => entryArray[0] === name)
      .map((entryArray) => entryArray[1]);
    if (resultArray.length === 1) {
      return resultArray[0];
    }
    return undefined;
  }

  static values(): T[] {
    return Object.entries(this).map((entryArray) => entryArray[1]);
  }

  name(): string {
    const enumClass = Object.getPrototypeOf(this).constructor;

    const resultArray = Object.entries(enumClass).filter((entryArray) => {
      return (entryArray[1] as BaseEnum<T>).uuid === this.uuid;
    });
    if (resultArray.length === 1) {
      return resultArray[0][0];
    }
    return '-';
  }

  equals(otherEnum: BaseEnum<T>): boolean {
    if (!otherEnum) {
      return false;
    }
    return this.uuid === otherEnum.uuid;
  }
}
