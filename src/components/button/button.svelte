<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import type * as Props from './props'

  // This black magic comes from this thread:
  // https://github.com/sveltejs/language-tools/issues/442#issuecomment-1278618531
  //
  // To quote that thread - This is "absolute bonkers!"
  //
  // It's interesting, minor variations which I would expect to work on don't,
  // and this is the only combination which seems to do what we want and I'm not
  // clear on why. You're welcome to try other approaches here.
  //
  // Tips, for if things aren't working right:
  // 1) npm run gen-types
  // 2) Reload your VSCode Window (sometimes the Svelte Type Checker struggles).
  // 3) Make sure any script tags on your component have a `lang="ts"` attribute.
  type Href = $$Generic<string | undefined>
  type Disabled = $$Generic<undefined extends Href ? boolean : undefined>
  type ExcludedProps = 'size' | 'href' | 'hreflang'

  interface CommonProps {
    kind?: Props.ButtonKind
    size?: Props.ButtonSize
    isLoading?: boolean
    fab?: boolean
  }

  type ButtonProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['button']>, ExcludedProps> & {
      isDisabled?: Disabled
      href?: never
    }

  type LinkProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['a']>, ExcludedProps> & {
      href: Href
    }

  type $$Props = LinkProps | ButtonProps

  export let kind: Props.ButtonKind = 'filled'
  export let size: Props.ButtonSize = 'medium'
  export let isLoading: boolean = false
  export let isDisabled: Disabled = undefined
  export let href: Href = undefined
  export let fab = false

  $: tag = href ? 'a' : ('button' as 'a' | 'button')

  const dispatch = createEventDispatcher()

  /**
   * Optional click handler
   */
  function onClick(event) {
    dispatch('click', event)
  }
</script>

<svelte:element
  this={tag}
  href={href || undefined}
  disabled={isDisabled || undefined}
  class="leoButton"
  class:isFilled={kind === 'filled'}
  class:isOutline={kind === 'outline'}
  class:isPlain={kind === 'plain'}
  class:isPlainFaint={kind === 'plain-faint'}
  class:isHero={kind === 'hero'}
  class:isJumbo={size === 'jumbo'}
  class:isLarge={size === 'large'}
  class:isMedium={size === 'medium'}
  class:isSmall={size === 'small'}
  class:isTiny={size === 'tiny'}
  class:fab
  class:isLoading
  on:click={onClick}
  {...$$restProps}
>
  <slot>Leo Button</slot>
</svelte:element>

<style lang="scss">
  :host {
    display: inline-block;
    flex-grow: 1;
  }
  :host button {
    width: 100%;
  }
  // Main styles and states
  .leoButton,
  .leoButton:visited:not(:hover) {
    // Gradients cannot have a transition, so we need to reset `transition`
    // to only apply to `box-shadow` and `border-color` in .isHero
    --default-transition: box-shadow 0.12s ease-in-out, color 0.12s ease-in-out,
      border-color 0.12s ease-in-out, opacity 0.12s ease-in-out;
    --box-shadow-hover: var(--leo-effect-elevation-02);
    --box-shadow-focus: var(--leo-effect-focus-state);
    --radius: 0;
    --border-color: transparent;
    --border-width: 0px;

    display: block;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.12s ease-in-out, var(--default-transition);
    box-shadow: none;
    border: solid var(--border-width, 0px) var(--border-color, transparent);
    border-radius: var(--radius);
    background: var(--bg);
    color: var(--color);
    text-decoration: none;
    padding: var(--leo-button-padding, var(--padding-y) var(--padding-x));
  }

  .leoButton:not(:disabled) {
    &:hover,
    [data-is-button-target]:hover :host .leoButton,
    [data-is-button-target]:hover .leoButton {
      background: var(--bg-hover, var(--bg));
      color: var(--color-hover, var(--color));
      box-shadow: var(--box-shadow-hover);
      border-color: var(--border-color-hover, var(--border-color));
    }

    &:active {
      opacity: 0.75;
      background: var(--bg-active, var(--bg));
      color: var(--color-active, var(--color-hover, var(--color)));
    }

    &:focus-visible {
      outline: none;
      color: var(--color-focus, var(--color));
      box-shadow: var(--box-shadow-focus);
      background: var(--bg-focus, var(--bg));
      border-color: var(--border-color-focus, var(--border-color));
    }
  }

  // State Definitions
  .leoButton.isLoading {
    opacity: 0.75;
    background: var(--bg-loading, var(--bg));
    color: var(--color-loading, var(--color));
  }
  :host:disabled .leoButton,
  .leoButton:disabled {
    background: var(--bg-disabled, var(--bg));
    color: var(--leo-color-text-disabled);
    border-color: var(--leo-color-button-disabled);
  }

  // Size Variations
  .leoButton.isTiny {
    --icon-size: 12px;
    font: var(--leo-font-components-button-small);
    --padding-y: 6px;
    --padding-x: var(--leo-spacing-m);
    --radius: 14px;
    --leo-icon-size: 16px;

    &.fab {
      --padding-x: 6px;
    }
  }
  .leoButton.isSmall {
    --icon-size: 20px;
    font: var(--leo-font-components-button-small);
    --padding-y: 8px;
    --padding-x: 14px;
    --radius: 16px;
    --leo-icon-size: 18px;

    &.fab {
      --padding-x: 8px;
    }
  }
  .leoButton.isMedium {
    --icon-size: 24px;
    font: var(--leo-font-components-button-default);
    --padding-y: 10px;
    --padding-x: 16px;
    --radius: 20px;
    --leo-icon-size: 20px;

    &.fab {
      --padding-x: 12px;
      --padding-y: 12px;
    }
  }
  .leoButton.isLarge {
    --icon-size: 24px;
    font: var(--leo-font-components-button-large);
    --padding-y: 12px;
    --padding-x: 30px;
    --radius: 23px;
    --leo-icon-size: 20px;

    &.fab {
      --padding-x: 15px;
      --padding-y: 15px;
    }
  }
  .leoButton.isJumbo {
    --icon-size: 24px;
    font: var(--leo-font-components-button-jumbo);
    --padding-y: 18px;
    --padding-x: 26px;
    --radius: 30px;
    --leo-icon-size: 24px;

    &.fab {
      --padding-x: 18px;
    }
  }

  // Kind Variations
  .leoButton.isFilled {
    --bg: var(--leo-color-button-background);
    --bg-hover: var(--leo-color-primitive-primary-70);
    --bg-active: var(--bg-hover);
    --bg-focus: var(--bg);
    --bg-loading: var(--bg);
    --bg-disabled: var(--leo-color-button-disabled);
    --color: white;
  }

  .leoButton.isOutline {
    --bg: transparent;
    --bg-active: --leo-color-gray-20;
    --color: var(--leo-color-text-interactive);
    --color-hover: var(--leo-color-primary-60);
    --color-focus: var(--leo-color-text-interactive);
    --color-loading: var(--leo-color-gray-70);
    --border-width: 1px;
    --border-color: var(--leo-color-divider-interactive);
    --border-color-hover: var(--leo-color-primitive-primary-40);
    --border-color-focus: var(--leo-color-divider-interactive);
    --box-shadow-focus: 0px 0px 0px 2px #423eee,
      0px 0px 0px 1px rgba(255, 255, 255, 0.3);

    @theme (dark) {
      --border-color-hover: var(--leo-color-primitive-primary-60);
    }
  }
  .leoButton.isPlain {
    --radius: 8px;
    --padding-x: 2px;
    --color: var(--leo-color-text-interactive);
    --color-hover: var(--leo-color-primary-60);
    --color-active: var(--color);
    --color-loading: var(--color);
    --box-shadow-hover: none;

    &:disabled {
      --color: var(--leo-color-text-primary);
    }
  }
  .leoButton.isPlainFaint {
    --radius: 8px;
    --padding-x: 2px;
    --color: var(--leo-color-gray-60);
    --color-hover: var(--leo-color-gray-70);
    --box-shadow-hover: none;
  }
  .leoButton.isHero {
    transition: var(--default-transition);
    --bg: transparent;
    --bg-focus: var(--bg);
    --bg-disabled: var(--leo-color-button-disabled);
    --color: white;
    --default-bg-opacity: 1;

    position: relative;
    z-index: 0;

    &:not(:disabled) {
      &::before,
      &::after {
        content: '';
        pointer-events: none;
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: var(--radius);
      }

      &::before {
        transition: var(--default-transition);
        z-index: -1;
        background: var(--leo-gradient-hero);
        opacity: var(--default-bg-opacity);
      }

      &::after {
        z-index: -2;
        background: linear-gradient(
          101.5deg,
          #770eaa 21.56%,
          #b72070 74.97%,
          #e6461e 104.58%
        );
      }
    }

    &:hover {
      --default-bg-opacity: 0;
    }
  }

  .leoButton.fab {
    --radius: 10000px;
    aspect-ratio: 1 / 1;
  }
</style>
