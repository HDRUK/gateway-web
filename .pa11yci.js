//*** local variables used in exports

var site      = 'web.dev.hdruk.cloud';

var ignoreDefault = [
  "WCAG2AAA.Principle1.Guideline1_4.1_4_3_F24.F24.FGColour",            // check for inherited BG color to complement inline FG color
  "WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail",                    // insufficient contrast: 7:1
  "WCAG2AAA.Principle1.Guideline1_4.1_4_6.G18.Fail",                    // insufficient contrast: 4.5:1
  // mostly for menus with cdk-overlay-container, cdk-global-overlay
  "WCAG2AAA.Principle1.Guideline1_4.1_4_10.C32,C31,C33,C38,SCR34,G206", // element has 'position: fixed'
];

var ignoreNotForm = [ ... ignoreDefault,
  "WCAG2AAA.Principle1.Guideline1_3.1_3_1.H44.NotFormControl"           // 'for' should point to form control (mat-select without control)
];

/**
 * Configuration for Pa11y-ci.
 */
module.exports = {

  // NOTE: defaults are OVERRIDDEN not extended
  defaults : {
    chromeLaunchConfig          : { 
        executablePath              : "/usr/bin/google-chrome-stable",
        args                        : ['--no-sandbox']
     },
    // concurrency=1 so urls are sequential, with login first (if browser context is preserved)
    concurrency                 : 1,
    ignore                      : ignoreDefault,
    // true to include non-actionable notices  (false by default)
    includeNotices              : true,
    // true to include non-actionable warnings (false by default)
    includeWarnings             : true,
    // e.g., error, warning, or notice
    level                       : "error",
    runners                     : ["axe"],
    // e.g., WCAG2A, WCAG2AA, WCAG2AAA (low to high), Section508 (deprecated)
    //standard                    : "WCAG2AAA",
    // timeout (in msec) for an entire test run
    timeout                     : 10000,
    // false to preserve browser context
    useIncognitoBrowserContext  : false,
  },

  urls : [
    { ignore  : ignoreNotForm,
      url     : `${site}`,
      timeout : 50000,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/dataset/1`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/cohort-discovery`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/cohort-discovery-request`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/contact-us`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/data-custodians`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/development-community`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/meet-the-team`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/our-mission-and-purpose`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/patients-and-public`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/about/researchers-innovators,`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/collection/1`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/community/work-with-us`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/data-custodian/1`,
      timeout : 50000,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/data-custodian/getting-started`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/data-use/1`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/help/glossary`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/help/tutorials`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/how-to-search`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/news/releases`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/newsletter-signup`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/search`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/search?sampleAvailability`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/search?type=dur`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/search?type=collections`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/search?type=data_providers`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/search?type=tools`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/support/cohort-discovery`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/support/data-access-request`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/support/data-use-register`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/support/gateway-schema`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/support`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/support/team-management`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/support/tools`,
    },
    { ignore  : ignoreNotForm,
      url     : `${site}/terms-and-conditions`,
    }
  ],

}; // end module.exports
