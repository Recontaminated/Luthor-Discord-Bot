import { PermissionResolvable } from "discord.js";
import client from "../index.js";
import Logger from "@utils/logger.js";
//this decorator marks a class that implements the TextCommand interface as a text command
export function textCommand(
  name: string,
  category: string,
  description: string,
  usage: string
) {
  return function (target: any, propertyKey: string) {
    Logger.debug("Adding Decorator command " + name);
    console.log(typeof target);
    console.log(propertyKey);
    const command = {
      name: name,
      category: category,
      description: description,
      usage: usage,
      run: target[propertyKey],
    };

    client.commands.text.set(name, command);
  };
}

export function requirePermission(permission: PermissionResolvable) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      if (!message.member.permissions.has(permission)) {
        return message.reply("You don't have the required permissions", {
          ephemeral: true,
        });
      }

      return originalFunction.apply(this, arguments);
    };
  };
}
export function argRegex(expression: RegExp) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      const args = arguments[1];
      if (expression.test(args)) {
        return message.reply("Please use the correct format");
      }

      return originalFunction.apply(this, arguments);
    };
  };
}
export function requireBotPermission(permission: PermissionResolvable) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      if (!message.guild.member.permissions.has(permission)) {
        return message.reply("I don't have the required permissions");
      }

      return originalFunction.apply(this, arguments);
    };
  };
}

export function onlyInGuild() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      if (!message.guild || !message.member) {
        return message.reply("This command must be run in a guild");
      }

      return originalFunction.apply(this, arguments);
    };
  };
}
