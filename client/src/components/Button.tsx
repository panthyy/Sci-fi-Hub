import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { ExclusiveVariant, ExclusiveVariants, Variants } from "@utils/index";
import { Spinner } from "./Spinner";
import React from "react";
type PrimaryVariant = {
  primary: true;
};

type SuccessVariant = {
  success: true;
};

type DangerVariant = {
  danger: true;
};

type ButtonVariants = ExclusiveVariants<
  [PrimaryVariant, SuccessVariant, DangerVariant]
> & {
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
} & ButtonVariants;

const BaseStyle = css`
  ${tw`px-4 py-2 w-fit rounded-md border-2 border-transparent shadow-md box-border font-inter font-semibold`}
  ${tw`hover:cursor-pointer  focus:outline-none active:scale-95`}
  ${tw`duration-200 ease-in-out transition`}
`;

const PrimaryStyle = css`
  ${tw`bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white`}
`;

const DangerButton = css`
  ${tw`bg-red-500 hover:bg-red-600 active:bg-red-700 text-white`}
`;

const SuccessButton = css`
  ${tw`bg-green-500  hover:bg-green-600 active:bg-green-700 text-white `}
`;

const DisabledButton = css`
  ${tw` opacity-50  pointer-events-none`}
`;

const variants: Variants<ButtonVariants> = new Map([
  ["base", BaseStyle],
  ["primary", PrimaryStyle],
  ["success", SuccessButton],
  ["danger", DangerButton],
  ["disabled", DisabledButton],
]);

const StyledButton = styled.button((props: ButtonProps) => {
  const { outline, success, danger, primary } = props;
  return [
    Variants(props, variants),
    outline && tw`bg-transparent hover:text-white`,
    outline && danger && tw`border-red-500 text-red-500 hover:bg-red-500`,
    outline &&
      success &&
      tw`border-green-500 text-green-500 hover:bg-green-500`,
    outline && primary && tw`border-blue-500 text-blue-500 hover:bg-blue-500`,
  ];
});
export const Button = (props: ButtonProps) => {
  return (
    <StyledButton {...props} css={props.loading && tw`relative`}>
      {props.loading && (
        <>
          <div
            css={tw`top-0  animate-spin left-0 absolute w-full h-full flex justify-center items-center`}
          >
            l
          </div>
          <div aria-hidden css={tw`opacity-0`}>
            {props.children}
          </div>
        </>
      )}
      {!props.loading && props.children}
    </StyledButton>
  );
};
