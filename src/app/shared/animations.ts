import {
  style,
  state,
  query,
  stagger,
  keyframes,
  animate,
  animation,
  trigger,
  transition,
  useAnimation,
  group
} from "@angular/animations";

export const speedDialFabAnimations = [
  trigger("fabToggler", [
    state(
      "inactive",
      style({
        transform: "rotate(0deg)"
      })
    ),
    state(
      "active",
      style({
        transform: "rotate(225deg)"
      })
    ),
    transition("* <=> *", animate("200ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
  ]),
  trigger("speedDialStagger", [
    transition("* => *", [
      query(":enter", style({ opacity: 0 }), { optional: true }),

      query(
        ":enter",
        stagger("40ms", [
          animate(
            "200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
            keyframes([
              style({ opacity: 0, transform: "translateY(10px)" }),
              style({ opacity: 1, transform: "translateY(0)" })
            ])
          )
        ]),
        { optional: true }
      ),

      query(
        ":leave",
        animate("200ms cubic-bezier(0.4, 0.0, 0.2, 1)", keyframes([style({ opacity: 1 }), style({ opacity: 0 })])),
        { optional: true }
      )
    ])
  ])
];

export const speedDialFabHalfAnimations = [
  trigger("fabToggler", [
    state(
      "inactive",
      style({
        transform: "rotate(0deg)"
      })
    ),
    state(
      "active",
      style({
        transform: "rotate(270deg)"
      })
    ),
    transition("* <=> *", animate("200ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
  ]),
  trigger("speedDialStagger", [
    transition("* => *", [
      query(":enter", style({ opacity: 0 }), { optional: true }),

      query(
        ":enter",
        stagger("40ms", [
          animate(
            "200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
            keyframes([
              style({ opacity: 0, transform: "translateY(10px)" }),
              style({ opacity: 1, transform: "translateY(0)" })
            ])
          )
        ]),
        { optional: true }
      ),

      query(
        ":leave",
        animate("200ms cubic-bezier(0.4, 0.0, 0.2, 1)", keyframes([style({ opacity: 1 }), style({ opacity: 0 })])),
        { optional: true }
      )
    ])
  ])
];

export const collapseAnimations = [
  trigger("expandCollapse", [
    state(
      "open",
      style({
        height: "*"
      })
    ),
    state(
      "close",
      style({
        height: "0px",
        "min-height": "0px",
        padding: "0px"
      })
    ),
    transition("open <=> close", animate(500))
  ])
];