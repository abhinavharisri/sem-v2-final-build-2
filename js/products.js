/* 
  PRODUCT IMAGES — HOW TO ADD:
  Each product has an optional "images" array.
  Add image paths like: images: ["/images/products/PRODUCT-1.jpg","/images/products/PRODUCT-2.jpg"]
  The modal carousel will automatically show them.
  If no images array, a placeholder icon is shown.
*/

const SEM_PRODUCTS = [
  // ─── BLOWERS / CENTRIFUGAL FANS ───────────────────────────────────────────

  {
    id: "single-inlet-forward-curved",
    category: "Blowers & Centrifugal Fans",
    name: "Single Inlet Forward Curved Impeller",
    models: ["1EC","5EC","6EC","7EC","9EC","10EC","11EC","12EC"],
    description: "High-efficiency single inlet forward curved impeller blowers for a wide range of industrial ventilation and air movement applications.",
    applications: ["HVAC","Air Conditioning","Refrigeration","Dust Extraction","Electronic Cooling"],
    specs: [
      { type:"1EC 1BF", supply:"230V, 1Ø, 50Hz", amps:0.22, watts:50, rpm:1450, airflow_cmh:55, airflow_cfm:32, static_pr:6, dba:50, cap_uf:1.0, amb_temp:60, weight:2.25 },
      { type:"1EC 1BT", supply:"230V, 1Ø, 50Hz", amps:0.15, watts:40, rpm:2750, airflow_cmh:140, airflow_cfm:82, static_pr:25, dba:72, cap_uf:2.0, amb_temp:60, weight:2.25 },
      { type:"1EC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.18, watts:50, rpm:2800, airflow_cmh:140, airflow_cfm:82, static_pr:25, dba:72, cap_uf:"—", amb_temp:60, weight:2.25 },
      { type:"5EC 1BT", supply:"230V, 1Ø, 50Hz", amps:0.35, watts:65, rpm:2700, airflow_cmh:290, airflow_cfm:171, static_pr:35, dba:64, cap_uf:2.0, amb_temp:60, weight:2.50 },
      { type:"5EC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.2, watts:90, rpm:2650, airflow_cmh:290, airflow_cfm:171, static_pr:35, dba:72, cap_uf:"—", amb_temp:60, weight:3.00 },
      { type:"6EC 1BT", supply:"230V, 1Ø, 50Hz", amps:0.40, watts:120, rpm:2600, airflow_cmh:410, airflow_cfm:241, static_pr:30, dba:73, cap_uf:2.0, amb_temp:60, weight:3.20 },
      { type:"6EC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:120, rpm:2750, airflow_cmh:410, airflow_cfm:241, static_pr:35, dba:74, cap_uf:"—", amb_temp:60, weight:3.60 },
      { type:"6EC 3BF", supply:"415V, 3Ø, 50Hz", amps:0.35, watts:70, rpm:1440, airflow_cmh:240, airflow_cfm:141, static_pr:20, dba:62, cap_uf:"—", amb_temp:60, weight:3.60 },
      { type:"7EC 1BT", supply:"230V, 1Ø, 50Hz", amps:0.60, watts:140, rpm:2550, airflow_cmh:500, airflow_cfm:294, static_pr:38, dba:68, cap_uf:4.0, amb_temp:60, weight:4.30 },
      { type:"7EC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:140, rpm:2550, airflow_cmh:500, airflow_cfm:294, static_pr:38, dba:68, cap_uf:"—", amb_temp:60, weight:4.40 },
      { type:"150EC 1BT", supply:"230V, 1Ø, 50/60Hz", amps:"0.65/0.75", watts:"155/180", rpm:"2500/2900", airflow_cmh:"450/520", airflow_cfm:"265/306", static_pr:"40/42", dba:"70/72", cap_uf:4, amb_temp:60, weight:4.50 },
      { type:"9EC 1BF", supply:"230V, 1Ø, 50Hz", amps:0.25, watts:55, rpm:1400, airflow_cmh:220, airflow_cfm:129, static_pr:18, dba:60, cap_uf:2.5, amb_temp:60, weight:4.50 },
      { type:"9EC 1BT", supply:"230V, 1Ø, 50Hz", amps:0.65, watts:160, rpm:2500, airflow_cmh:450, airflow_cfm:265, static_pr:40, dba:70, cap_uf:4.0, amb_temp:60, weight:4.50 },
      { type:"9EC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:160, rpm:2500, airflow_cmh:450, airflow_cfm:265, static_pr:40, dba:70, cap_uf:"—", amb_temp:60, weight:4.50 },
      { type:"10EC 1BT", supply:"230V, 1Ø, 50Hz", amps:1.00, watts:235, rpm:2300, airflow_cmh:630, airflow_cfm:371, static_pr:55, dba:70, cap_uf:6.0, amb_temp:60, weight:4.00 },
      { type:"10EC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.30, watts:200, rpm:2300, airflow_cmh:630, airflow_cfm:371, static_pr:55, dba:70, cap_uf:"—", amb_temp:60, weight:4.00 },
      { type:"11EC 1BT", supply:"230V, 1Ø, 50Hz", amps:1.80, watts:400, rpm:2350, airflow_cmh:750, airflow_cfm:440, static_pr:60, dba:72, cap_uf:6.0, amb_temp:60, weight:4.80 },
      { type:"11EC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.65, watts:360, rpm:2450, airflow_cmh:780, airflow_cfm:460, static_pr:60, dba:72, cap_uf:"—", amb_temp:60, weight:4.80 },
      { type:"12EC 1BF", supply:"230V, 1Ø, 50Hz", amps:0.65, watts:170, rpm:1350, airflow_cmh:1050, airflow_cfm:618, static_pr:20, dba:68, cap_uf:5.0, amb_temp:60, weight:7.50 },
      { type:"12EC 3BF", supply:"415V, 3Ø, 50Hz", amps:0.40, watts:200, rpm:1350, airflow_cmh:1050, airflow_cfm:618, static_pr:20, dba:68, cap_uf:"—", amb_temp:60, weight:7.50 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/1ec-1bt-2-optimized.jpg",
      "/images/products/1ec-1bt-3-optimized.jpg",
      "/images/products/1ec-1bt-4.jpg",
      "/images/products/6ec-1bt-1.jpg",
      "/images/products/6ec-1bt-2.jpg",
      "/images/products/6ec-1bt-3.jpg",
      "/images/products/9ec-3bt-1.jpg",
      "/images/products/10ec-1bt-1.jpg",
      "/images/products/10ec-1bt-2.jpg",
      "/images/products/10ec-1bt-3.jpg",
      "/images/products/11ec-3bt-1.jpg",
      "/images/products/11ec-3bt-2.jpg",
      "/images/products/11ec-3bt-3.jpg"
    ],
    note: "Tolerance ±5% on Specified values"
  },

  {
    id: "double-inlet-133",
    category: "Blowers & Centrifugal Fans",
    name: "Double Inlet Forward Curved Impeller — 133 Series",
    models: ["SDB 133"],
    description: "Double inlet forward curved impeller blowers in the 133 series, delivering high airflow for demanding HVAC and industrial cooling applications.",
    applications: ["HVAC","Air Conditioning","Industrial Cooling","Forced Ventilation"],
    specs: [
      { type:"SDB 133 T4", supply:"415V, 3Ø, 50Hz", amps:0.38, watts:100, rpm:1450, airflow_cmh:550, airflow_cfm:324, static_pr:30, dba:55, cap_uf:"—", amb_temp:60, weight:4.2 },
      { type:"SDB 133 S2/35", supply:"230V, 1Ø, 50Hz", amps:0.80, watts:180, rpm:2300, airflow_cmh:825, airflow_cfm:485, static_pr:44, dba:60, cap_uf:3.15, amb_temp:60, weight:4.2 },
      { type:"SDB 133 S2/25", supply:"230V, 1Ø, 50Hz", amps:0.5, watts:140, rpm:1750, airflow_cmh:620, airflow_cfm:365, static_pr:38, dba:55, cap_uf:2.5, amb_temp:60, weight:4.3 },
      { type:"SDB 133 S4", supply:"230V, 1Ø, 50Hz", amps:0.25, watts:60, rpm:1400, airflow_cmh:500, airflow_cfm:295, static_pr:28, dba:55, cap_uf:2.0, amb_temp:60, weight:4.2 },
      { type:"SDB 133 T2", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:175, rpm:2450, airflow_cmh:850, airflow_cfm:500, static_pr:45, dba:60, cap_uf:"—", amb_temp:60, weight:3.8 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-133-s2-1.jpg",
      "/images/products/sdb-133-s2-2.jpg"
    ],
    note: "Tolerance ±5% on Specified values"
  },

  {
    id: "double-inlet-140",
    category: "Blowers & Centrifugal Fans",
    name: "Double Inlet Forward Curved Impeller — 140 Series",
    models: ["SDB 140"],
    description: "140 Series double inlet blowers offering high static pressure and airflow for air handling and ventilation systems.",
    applications: ["Air Handling Units","HVAC","Industrial Ventilation"],
    specs: [
      { type:"SDB 140 S2", supply:"230V, 1Ø, 50Hz", amps:1.25, watts:250, rpm:2450, airflow_cmh:900, airflow_cfm:529, static_pr:47, dba:72, cap_uf:6, amb_temp:60, weight:5.3 },
      { type:"SDB 140 S4", supply:"230V, 1Ø, 50Hz", amps:0.5, watts:110, rpm:1400, airflow_cmh:620, airflow_cfm:365, static_pr:25, dba:65, cap_uf:4, amb_temp:60, weight:5.3 },
      { type:"SDB 140 T2", supply:"415V, 3Ø, 50Hz", amps:0.35, watts:250, rpm:2300, airflow_cmh:850, airflow_cfm:500, static_pr:46, dba:72, cap_uf:"—", amb_temp:60, weight:5.3 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-150-t2-1.jpg",
      "/images/products/sdb-150-t2-2.jpg",
      "/images/products/sdb-150-t2-3.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "double-inlet-150",
    category: "Blowers & Centrifugal Fans",
    name: "Double Inlet Forward Curved Impeller — 150 Series",
    models: ["SDB 150"],
    description: "150 Series double inlet blowers for high-capacity air movement in large HVAC, industrial and commercial ventilation systems.",
    applications: ["HVAC","Large Ventilation Systems","Industrial Cooling"],
    specs: [
      { type:"SDB 150 S2", supply:"230V, 1Ø, 50Hz", amps:2, watts:450, rpm:2700, airflow_cmh:1200, airflow_cfm:706, static_pr:50, dba:76, cap_uf:12.5, amb_temp:60, weight:8.5 },
      { type:"SDB 150 T2", supply:"415V, 3Ø, 50Hz", amps:0.75, watts:430, rpm:2600, airflow_cmh:1200, airflow_cfm:706, static_pr:50, dba:76, cap_uf:"—", amb_temp:60, weight:8.5 },
      { type:"SDB 150 S4", supply:"230V, 1Ø, 50Hz", amps:0.4, watts:100, rpm:1440, airflow_cmh:620, airflow_cfm:365, static_pr:14, dba:61, cap_uf:4, amb_temp:60, weight:8.5 },
      { type:"SDB 150 T4", supply:"415V, 3Ø, 50Hz", amps:0.65, watts:130, rpm:1450, airflow_cmh:620, airflow_cfm:365, static_pr:14, dba:61, cap_uf:"—", amb_temp:60, weight:8.5 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-150-t2-1.jpg",
      "/images/products/sdb-150-t2-2.jpg",
      "/images/products/sdb-150-t2-3.jpg",
      "/images/products/sdb-150-t2-4.jpg",
      "/images/products/sdb-150-t2-5.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "double-inlet-180",
    category: "Blowers & Centrifugal Fans",
    name: "Double Inlet Forward Curved Impeller — 180 Series",
    models: ["SDB 180"],
    description: "180 Series high-capacity double inlet blowers delivering powerful airflow for large industrial and commercial ventilation applications.",
    applications: ["Industrial Ventilation","HVAC","Condenser Cooling"],
    specs: [
      { type:"SDB 180 S2", supply:"230V, 1Ø, 50Hz", amps:4.2, watts:950, rpm:2550, airflow_cmh:2150, airflow_cfm:1265, static_pr:70, dba:80, cap_uf:15, amb_temp:60, weight:14 },
      { type:"SDB 180 T2", supply:"415V, 3Ø, 50Hz", amps:1.25, watts:750, rpm:2550, airflow_cmh:2150, airflow_cfm:1265, static_pr:70, dba:80, cap_uf:"—", amb_temp:60, weight:14 },
      { type:"SDB 180 S4", supply:"230V, 1Ø, 50Hz", amps:1.2, watts:260, rpm:1350, airflow_cmh:1300, airflow_cfm:765, static_pr:22, dba:67, cap_uf:8, amb_temp:60, weight:14 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-180-t2-1.jpg",
      "/images/products/sdb-180-t2-2.jpg",
      "/images/products/sdb-180-t2-3.jpg",
      "/images/products/sdb-180-t2-4.jpg",
      "/images/products/sdb-180-t2-5.jpg",
      "/images/products/sdb-180-t2-6.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "double-inlet-200-255",
    category: "Blowers & Centrifugal Fans",
    name: "Double Inlet Forward Curved Impeller — 200–255 Series",
    models: ["SDB 200","SDB 220","SDB 240","SDB 255"],
    description: "Heavy-duty double inlet blowers in the 200–255 Series for the most demanding industrial air movement requirements.",
    applications: ["Heavy Industrial Ventilation","Large HVAC Systems","Forced Cooling"],
    specs: [
      { type:"SDB 200 T2", supply:"415V, 3Ø, 50Hz", amps:2.6, watts:1500, rpm:2700, airflow_cmh:2600, airflow_cfm:1529, static_pr:85, dba:85, cap_uf:"—", amb_temp:60, weight:18 },
      { type:"SDB 220 T2", supply:"415V, 3Ø, 50Hz", amps:2.80, watts:1600, rpm:2600, airflow_cmh:2800, airflow_cfm:1647, static_pr:115, dba:87, cap_uf:"—", amb_temp:60, weight:19 },
      { type:"SDB 220 S4", supply:"230V, 1Ø, 50Hz", amps:2, watts:500, rpm:1400, airflow_cmh:1650, airflow_cfm:971, static_pr:30, dba:70, cap_uf:12.5, amb_temp:60, weight:16 },
      { type:"SDB 220 T4", supply:"415V, 3Ø, 50Hz", amps:0.7, watts:360, rpm:1400, airflow_cmh:1650, airflow_cfm:971, static_pr:30, dba:70, cap_uf:"—", amb_temp:60, weight:16 },
      { type:"SDB 240 S4", supply:"230V, 1Ø, 50Hz", amps:2.7, watts:650, rpm:1400, airflow_cmh:2750, airflow_cfm:1618, static_pr:40, dba:72, cap_uf:15, amb_temp:60, weight:19 },
      { type:"SDB 240 T4", supply:"415V, 3Ø, 50Hz", amps:1.2, watts:750, rpm:1400, airflow_cmh:2750, airflow_cfm:1618, static_pr:40, dba:72, cap_uf:"—", amb_temp:60, weight:20 },
      { type:"SDB 255 T4", supply:"415V, 3Ø, 50Hz", amps:3.2, watts:1250, rpm:1400, airflow_cmh:3400, airflow_cfm:2000, static_pr:75, dba:85, cap_uf:"—", amb_temp:60, weight:24 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-220-t2-1.jpg",
      "/images/products/sdb-220-t2-2.jpg",
      "/images/products/sdb-220-t2-3.jpg",
      "/images/products/sdb-220-t2-4.jpg",
      "/images/products/sdb-220-t2-5.jpg",
      "/images/products/sdb-240-t4-1.jpg",
      "/images/products/sdb-240-t4-2.jpg",
      "/images/products/sdb-240-t4-3.jpg",
      "/images/products/sdb255-t4-1.jpg",
      "/images/products/sdb255-t4-2.jpg",
      "/images/products/sdb255-t4-3.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "double-inlet-backward-250",
    category: "Blowers & Centrifugal Fans",
    name: "Double Inlet Backward Curved Impeller — 250 Series",
    models: ["SDB 250 BC"],
    description: "Backward curved impeller design delivering high static pressure with lower noise levels, ideal for demanding industrial applications.",
    applications: ["High Static Pressure Applications","Industrial Ventilation","Clean Air Systems"],
    specs: [
      { type:"SDB 250 BC S2", supply:"230V, 1Ø, 50Hz", amps:2.0, watts:450, rpm:2750, airflow_cmh:1600, airflow_cfm:941, static_pr:85, dba:85, cap_uf:12.5, amb_temp:60, weight:15 },
      { type:"SDB 250 BC T2", supply:"415V, 3Ø, 50Hz", amps:0.75, watts:400, rpm:2750, airflow_cmh:1600, airflow_cfm:941, static_pr:85, dba:85, cap_uf:"—", amb_temp:60, weight:15 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-250-bc-s2-1.jpg",
      "/images/products/sdb-250-bc-s2-2.jpg",
      "/images/products/sdb-250-bc-s2-3.jpg",
      "/images/products/sdb-250-bc-s2-4.jpg",
      "/images/products/sdb-250-bc-s2-5.jpg",
      "/images/products/sdb-250-bc-s2-6.jpg",
      "/images/products/sdb-250-bc-s2-7.jpg",
      "/images/products/sdb-250-bc-s2-8.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "mini-blower",
    category: "Blowers & Centrifugal Fans",
    name: "Mini Blower",
    models: ["MB 1BT"],
    description: "Compact mini blower for small-scale cooling and ventilation. Ideal for bakery ovens, panel cooling, and mild cooling applications.",
    applications: ["Bakery Ovens","Fire Gas Stove","Panel Cooling","Mild Cooling with Flow Control"],
    specs: [
      { type:"MB 1BT", supply:"230V, 1Ø, 50Hz", amps:0.14, watts:25, rpm:2800, airflow_cmh:94, airflow_cfm:55, static_pr:8, dba:50, cap_uf:1.0, amb_temp:"60°C", weight:1.1 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp","Weight Kg"],
    images: [
      "/images/products/mb-1bt-1.jpg",
      "/images/products/mb-1bt-2.jpg",
      "/images/products/mb-1bt-3.jpg",
      "/images/products/mb-1bt-4.jpg"
    ],
        note: "Tolerance ±5% on Specified values. Cleat and Rivet type casing."
  },

  {
    id: "conventional-single-inlet-blower",
    category: "Blowers & Centrifugal Fans",
    name: "Conventional Single Inlet Blower",
    models: ["SSB 53","SSB 55","SSB 60","SSB 63"],
    description: "Conventional single inlet blowers for general industrial ventilation, exhaust, and air supply applications.",
    applications: ["General Ventilation","Kitchen Exhaust","Industrial Air Supply"],
    specs: [
      { type:"SSB 53 S2", supply:"230V, 1Ø, 50Hz", amps:0.45, watts:90, rpm:2750, airflow_cmh:450, airflow_cfm:265, static_pr:42, dba:65, cap_uf:4, amb_temp:60, weight:3.4 },
      { type:"SSB 55 S2", supply:"230V, 1Ø, 50Hz", amps:0.50, watts:120, rpm:2750, airflow_cmh:600, airflow_cfm:353, static_pr:42, dba:66, cap_uf:4, amb_temp:60, weight:3.8 },
      { type:"SSB 60 S2", supply:"230V, 1Ø, 50Hz", amps:0.65, watts:160, rpm:2750, airflow_cmh:650, airflow_cfm:382, static_pr:45, dba:68, cap_uf:4, amb_temp:60, weight:4.0 },
      { type:"SSB 63 S2", supply:"230V, 1Ø, 50Hz", amps:0.7, watts:170, rpm:2750, airflow_cmh:700, airflow_cfm:412, static_pr:45, dba:70, cap_uf:5, amb_temp:60, weight:4.5 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-53-s2-1.jpg",
      "/images/products/sdb-53-s2-2.jpg",
      "/images/products/sdb-53-s2-3.jpg",
      "/images/products/sdb-53-s2-4.jpg",
      "/images/products/sdb-53-s2-5.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "conventional-double-inlet-double-blower",
    category: "Blowers & Centrifugal Fans",
    name: "Conventional Double Inlet Double Blower",
    models: ["SDB 53","SDB 55","SDB 60","SDB 75"],
    description: "Double inlet double blowers for high-volume air handling and ventilation in HVAC and industrial systems.",
    applications: ["HVAC","Air Handling","Industrial Ventilation","Condenser Cooling"],
    specs: [
      { type:"SDB 53 S2", supply:"230V, 1Ø, 50Hz", amps:0.70, watts:165, rpm:2800, airflow_cmh:800, airflow_cfm:471, static_pr:40, dba:77, cap_uf:5, amb_temp:60, weight:4.5 },
      { type:"SDB 53 S4", supply:"230V, 1Ø, 50Hz", amps:0.40, watts:75, rpm:1400, airflow_cmh:350, airflow_cfm:206, static_pr:15, dba:60, cap_uf:2, amb_temp:60, weight:4.5 },
      { type:"SDB 55 S2", supply:"230V, 1Ø, 50Hz", amps:0.80, watts:190, rpm:2800, airflow_cmh:1150, airflow_cfm:676, static_pr:40, dba:75, cap_uf:5, amb_temp:60, weight:5.0 },
      { type:"SDB 60 S2", supply:"230V, 1Ø, 50Hz", amps:1.0, watts:235, rpm:2500, airflow_cmh:1250, airflow_cfm:735, static_pr:45, dba:80, cap_uf:5, amb_temp:60, weight:5.3 },
      { type:"SDB 75 S2", supply:"230V, 1Ø, 50Hz", amps:2.40, watts:520, rpm:2750, airflow_cmh:2500, airflow_cfm:1470, static_pr:50, dba:75, cap_uf:8, amb_temp:60, weight:9.0 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-53-s2-1.jpg",
      "/images/products/sdb-53-s2-6.jpg",
      "/images/products/sdb-53-s2-7.jpg",
      "/images/products/sdb-53-s2-8.jpg",
      "/images/products/sdb-53-s2-9.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "conventional-single-inlet-double-blower",
    category: "Blowers & Centrifugal Fans",
    name: "Conventional Single Inlet Double Blower",
    models: ["SDB 63"],
    description: "Single inlet double blower delivering high airflow for large-scale ventilation and air conditioning applications.",
    applications: ["Large HVAC","Industrial Ventilation","Air Conditioning"],
    specs: [
      { type:"SDB 63 S2", supply:"230V, 1Ø, 50Hz", amps:1, watts:240, rpm:2700, airflow_cmh:1300, airflow_cfm:765, static_pr:40, dba:73, cap_uf:6, amb_temp:60, weight:6.0 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sdb-53-s2-1.jpg",
      "/images/products/sdb-53-s2-2.jpg",
      "/images/products/sdb-53-s2-3.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "portable-blower-inflatables",
    category: "Blowers & Centrifugal Fans",
    name: "Portable Blower (For Inflatables)",
    models: ["SEB 23"],
    description: "Heavy-duty portable blower designed for inflatable structures. High airflow output with robust construction.",
    applications: ["Inflatables","Sky Dancers","Bounce Houses","Industrial Inflatables"],
    specs: [
      { type:"SEB 23 S2", supply:"230V, 1Ø, 50Hz", amps:7, watts:1500, rpm:2800, airflow_cmh:2500, airflow_cfm:1471, static_pr:85, dba:77, cap_uf:25, amb_temp:65, weight:21 },
      { type:"SEB 23 S2/SPL", supply:"230V, 1Ø, 60Hz", amps:9, watts:2100, rpm:2850, airflow_cmh:2600, airflow_cfm:1529, static_pr:88, dba:80, cap_uf:25, amb_temp:65, weight:22 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/seb-23-s2-1.jpg",
      "/images/products/seb-23-s2-2.jpg",
      "/images/products/seb-23-s2-3.jpg",
      "/images/products/seb-23-s2-4.jpg",
      "/images/products/seb-23-s2-5.jpg",
      "/images/products/seb-23-s2-6.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "blowers-for-inflatables",
    category: "Blowers & Centrifugal Fans",
    name: "Blowers for Inflatables",
    models: ["5EC W/F","6EC W/F","9EC W/F","10EC W/F","SKD 400","LED 450","SPI 30","SPI 36","SPI 43"],
    description: "Specialized blowers for inflatable structures including sky dancers, LED rotating blowers and plastic enclosure variants.",
    applications: ["Sky Dancers","LED Inflatables","Advertising Inflatables","Event Structures"],
    specs: [
      { type:"5EC1BT W/F", supply:"230V, 1Ø, 50Hz", amps:0.35, watts:60, rpm:2700, airflow_cmh:275, airflow_cfm:"-", static_pr:36, dba:64, weight:2.00 },
      { type:"6EC1BT W/F", supply:"230V, 1Ø, 50Hz", amps:0.40, watts:120, rpm:2600, airflow_cmh:400, airflow_cfm:"-", static_pr:38, dba:68, weight:3.00 },
      { type:"9EC1BT W/F", supply:"230V, 1Ø, 50Hz", amps:0.65, watts:160, rpm:2550, airflow_cmh:450, airflow_cfm:"-", static_pr:40, dba:69, weight:4.25 },
      { type:"10EC1BT W/F", supply:"230V, 1Ø, 50Hz", amps:1.00, watts:230, rpm:2350, airflow_cmh:600, airflow_cfm:"-", static_pr:55, dba:72, weight:4.50 },
      { type:"SKD 400 S2", supply:"230V, 1Ø, 50Hz", amps:3.20, watts:1500, rpm:2880, airflow_cmh:11000, airflow_cfm:"-", static_pr:55, dba:65, weight:18.0 },
      { type:"LED 450 S2", supply:"230V, 1Ø, 50Hz", amps:0.60, watts:150, rpm:2800, airflow_cmh:400, airflow_cfm:"-", static_pr:28, dba:60, weight:10.0 },
      { type:"SPI 30 S2", supply:"230V, 1Ø, 50Hz", amps:1.00, watts:250, rpm:2800, airflow_cmh:240, airflow_cfm:"-", static_pr:180, dba:66, weight:2.5 },
      { type:"SPI 36 S2", supply:"230V, 1Ø, 50Hz", amps:1.20, watts:370, rpm:2800, airflow_cmh:360, airflow_cfm:"-", static_pr:200, dba:69, weight:3.5 },
      { type:"SPI 43 S2", supply:"230V, 1Ø, 50Hz", amps:1.60, watts:610, rpm:2800, airflow_cmh:600, airflow_cfm:"-", static_pr:210, dba:73, weight:7.2 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Static PR (mm-wc)","dBA","Weight Kg"],
    images: [
      "/images/products/skd-400-s2-1.jpg",
      "/images/products/skd-400-s2-2.jpg",
      "/images/products/skd-400-s2-3.jpg",
      "/images/products/skd-400-s2-4.jpg",
      "/images/products/skd-400-s2-5.jpg",
      "/images/products/skd-400-s2-6.jpg",
      "/images/products/seb-23-s2-7.jpg",
      "/images/products/seb-23-s2-8.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "backward-curved-radial-fans",
    category: "Blowers & Centrifugal Fans",
    name: "Backward Curved Radial Fans",
    models: ["SBC 14","SBC 19","SBC 22","SBC 23","SBC 25/35","SBC 25/45"],
    description: "Backward curved radial fans offering high efficiency and low noise. Ideal for electronics cooling, variable frequency drives, and clean air applications.",
    applications: ["Variable Frequency Drives","Electronic Cooling","Control Panels","Clean Air Equipment"],
    specs: [
      { type:"SBC 14 S2", supply:"230V, 1Ø, 50Hz", amps:0.08, watts:25, rpm:2800, airflow_cmh:290, airflow_cfm:171, static_pr:17, dba:50, cap_uf:1, amb_temp:60, weight:0.9 },
      { type:"SBC 14 T2", supply:"415V, 3Ø, 50Hz", amps:0.10, watts:35, rpm:2800, airflow_cmh:290, airflow_cfm:170, static_pr:17, dba:50, cap_uf:"—", amb_temp:60, weight:0.9 },
      { type:"SBC 19 S2", supply:"230V, 1Ø, 50Hz", amps:0.35, watts:75, rpm:2550, airflow_cmh:570, airflow_cfm:335, static_pr:32, dba:62, cap_uf:2, amb_temp:60, weight:1.2 },
      { type:"SBC 19 S4", supply:"230V, 1Ø, 50Hz", amps:0.21, watts:28, rpm:1340, airflow_cmh:300, airflow_cfm:176, static_pr:12, dba:54, cap_uf:2, amb_temp:60, weight:1.2 },
      { type:"SBC 19 T2", supply:"415V, 3Ø, 50Hz", amps:0.20, watts:80, rpm:2550, airflow_cmh:570, airflow_cfm:335, static_pr:32, dba:55, cap_uf:"—", amb_temp:60, weight:1.2 },
      { type:"SBC 22 S2", supply:"230V, 1Ø, 50Hz", amps:0.40, watts:110, rpm:2700, airflow_cmh:885, airflow_cfm:521, static_pr:42, dba:72, cap_uf:2, amb_temp:60, weight:2.0 },
      { type:"SBC 23 S2", supply:"230V, 1Ø, 50Hz", amps:0.55, watts:130, rpm:2650, airflow_cmh:1200, airflow_cfm:706, static_pr:55, dba:70, cap_uf:4, amb_temp:60, weight:2.5 },
      { type:"SBC 23 T2", supply:"415V, 3Ø, 50Hz", amps:0.45, watts:135, rpm:2650, airflow_cmh:1200, airflow_cfm:706, static_pr:55, dba:70, cap_uf:"—", amb_temp:60, weight:2.5 },
      { type:"SBC 25 S4/35", supply:"230V, 1Ø, 50Hz", amps:0.20, watts:100, rpm:1400, airflow_cmh:810, airflow_cfm:476, static_pr:18, dba:61, cap_uf:2, amb_temp:60, weight:2.2 },
      { type:"SBC 25 S2/35", supply:"230V, 1Ø, 50Hz", amps:0.60, watts:140, rpm:2650, airflow_cmh:1230, airflow_cfm:724, static_pr:52, dba:73, cap_uf:4, amb_temp:60, weight:2.6 },
      { type:"SBC 25 T2/35", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:130, rpm:2600, airflow_cmh:1200, airflow_cfm:705, static_pr:51, dba:72, cap_uf:"—", amb_temp:60, weight:2.6 },
      { type:"SBC 25 S2/45", supply:"230V, 1Ø, 50Hz", amps:0.70, watts:175, rpm:2600, airflow_cmh:1450, airflow_cfm:853, static_pr:57, dba:75, cap_uf:5, amb_temp:60, weight:3.1 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sbc-14-t2-1.jpg",
      "/images/products/sbc-14-t2-2.jpg",
      "/images/products/sbc-14-t2-3.jpg",
      "/images/products/sbc-14-t2-4.jpg",
      "/images/products/sbc-14-t2-5.jpg",
      "/images/products/sbc-25-s2-1.jpg",
      "/images/products/sbc-25-s2-2.jpg",
      "/images/products/sbc-25-s2-3.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "single-inlet-backward-curved",
    category: "Blowers & Centrifugal Fans",
    name: "Single Inlet Backward Curved Impeller Series",
    models: ["8EC","1C 8EC","2C 8EC","23BC","25BC"],
    description: "Single inlet backward curved impeller blowers for high-efficiency air movement with lower noise characteristics.",
    applications: ["Electronic Cooling","HVAC","Industrial Ventilation","Control Panel Cooling"],
    specs: [
      { type:"8 EC 1BTP", supply:"230V, 1Ø, 50Hz", amps:0.6, watts:110, rpm:2700, airflow_cmh:880, airflow_cfm:518, static_pr:42, dba:65, cap_uf:3.15, amb_temp:60, weight:2.5 },
      { type:"8 EC 3BTP", supply:"415V, 3Ø, 50Hz", amps:0.2, watts:100, rpm:2700, airflow_cmh:880, airflow_cfm:518, static_pr:42, dba:65, cap_uf:"—", amb_temp:60, weight:2.5 },
      { type:"1C-8 EC 1BTP", supply:"230V, 1Ø, 50Hz", amps:0.6, watts:110, rpm:2700, airflow_cmh:880, airflow_cfm:518, static_pr:42, dba:66, cap_uf:3.15, amb_temp:60, weight:6.0 },
      { type:"1C-8 EC 3BTP", supply:"415V, 3Ø, 50Hz", amps:0.2, watts:100, rpm:2700, airflow_cmh:880, airflow_cfm:518, static_pr:42, dba:66, cap_uf:"—", amb_temp:60, weight:6.0 },
      { type:"2C-8EC 1BTP", supply:"230V, 1Ø, 50Hz", amps:1.2, watts:240, rpm:2700, airflow_cmh:1760, airflow_cfm:1035, static_pr:42, dba:80, cap_uf:3.15, amb_temp:60, weight:9.1 },
      { type:"2C-8 EC 3BTP", supply:"415V, 3Ø, 50Hz", amps:0.4, watts:180, rpm:2700, airflow_cmh:1760, airflow_cfm:1035, static_pr:42, dba:80, cap_uf:"—", amb_temp:60, weight:9.1 },
      { type:"23BC 1BT", supply:"230V, 1Ø, 50Hz", amps:0.53, watts:130, rpm:2650, airflow_cmh:1200, airflow_cfm:706, static_pr:55, dba:70, cap_uf:4, amb_temp:60, weight:7.0 },
      { type:"23BC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:140, rpm:2650, airflow_cmh:1200, airflow_cfm:706, static_pr:55, dba:70, cap_uf:"—", amb_temp:60, weight:7.0 },
      { type:"25BC 1BT", supply:"230V, 1Ø, 50Hz", amps:0.60, watts:140, rpm:2450, airflow_cmh:1230, airflow_cfm:724, static_pr:55, dba:74, cap_uf:4, amb_temp:60, weight:7.5 },
      { type:"25BC 3BT", supply:"415V, 3Ø, 50Hz", amps:0.30, watts:150, rpm:2450, airflow_cmh:1230, airflow_cfm:724, static_pr:55, dba:74, cap_uf:"—", amb_temp:60, weight:7.5 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/1c-sbc-19-t2-1.jpg",
      "/images/products/1c-sbc-19-t2-2.jpg",
      "/images/products/1c-sbc-19-t2-3.jpg",
      "/images/products/1c-sbc-23-s2-1.jpg",
      "/images/products/1c-sbc-23-s2-2.jpg",
      "/images/products/1c-sbc-23-s2-3.jpg",
      "/images/products/2c-8ec-1btp-1-optimized.jpg",
      "/images/products/2c-8ec-1btp-2.jpg",
      "/images/products/2c-8ec-1btp-3.jpg",
      "/images/products/8ec-3btp-1.jpg",
      "/images/products/8ec-3btp-2.jpg",
      "/images/products/8ec-3btp-3.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "single-inlet-external-motor",
    category: "Blowers & Centrifugal Fans",
    name: "Single Inlet Forward Curved Imp. with External Motor",
    models: ["130 IM","150 IM","160 IM","170 IM"],
    description: "Single inlet forward curved blowers with external induction motor for high-temperature and heavy-duty industrial applications.",
    applications: ["High Temperature Applications","Industrial Exhaust","Forced Ventilation","Plastic Extrusion"],
    specs: [
      { type:"130 IM 3BT", supply:"415V, 3Ø, 50Hz", amps:0.65, watts:200, rpm:2880, airflow_cmh:420, airflow_cfm:"-", static_pr:68, dba:80, amb_temp:"80°C", weight:5.4 },
      { type:"150 IM 3BT", supply:"415V, 3Ø, 50Hz", amps:0.70, watts:250, rpm:2880, airflow_cmh:500, airflow_cfm:"-", static_pr:40, dba:72, amb_temp:"80°C", weight:5.6 },
      { type:"160 IM 3BT", supply:"415V, 3Ø, 50Hz", amps:0.75, watts:275, rpm:2800, airflow_cmh:650, airflow_cfm:"-", static_pr:55, dba:74, amb_temp:"80°C", weight:6.0 },
      { type:"170 IM 3BT", supply:"415V, 3Ø, 50Hz", amps:0.76, watts:300, rpm:2800, airflow_cmh:800, airflow_cfm:"-", static_pr:58, dba:76, amb_temp:"80°C", weight:6.75 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Static PR (mm-wc)","dBA","Amb. Temp","Weight Kg"],
    images: [
      "/images/products/im-250-t2-1.jpg",
      "/images/products/im-250-t2-2.jpg",
      "/images/products/im-250-t2-3.jpg",
      "/images/products/im-250-t2-4.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "heavy-duty-centrifugal-blower",
    category: "Blowers & Centrifugal Fans",
    name: "Heavy Duty Centrifugal Blower",
    models: ["IM 180","IM 200","IM 250","IM 300","IM 350"],
    description: "Industrial-grade heavy duty centrifugal blowers with external motor. Available up to 12.5HP with custom configurations. High temperature operation up to 350°C. Belt driven options available.",
    applications: ["Plastic Extrusion","High Temperature Processes","Forced Cooling","Industrial Exhaust","Gas Burners"],
    specs: [
      { type:"IM 180 T2-0.25HP", supply:"415V, 3Ø, 50Hz", amps:0.65, watts:200, rpm:2850, airflow_cmh:600, airflow_cfm:353, static_pr:55, weight:"-" },
      { type:"IM 200 T4-0.5HP", supply:"415V, 3Ø, 50Hz", amps:0.8, watts:375, rpm:1400, airflow_cmh:350, airflow_cfm:205, static_pr:30, weight:"-" },
      { type:"IM 200 T2-0.5HP", supply:"415V, 3Ø, 50Hz", amps:0.8, watts:375, rpm:2800, airflow_cmh:750, airflow_cfm:441, static_pr:75, weight:"-" },
      { type:"IM 250 T4-1HP", supply:"415V, 3Ø, 50Hz", amps:1.7, watts:750, rpm:1400, airflow_cmh:1020, airflow_cfm:600, static_pr:60, weight:"-" },
      { type:"IM 250 T2-1HP", supply:"415V, 3Ø, 50Hz", amps:1.7, watts:750, rpm:2800, airflow_cmh:2300, airflow_cfm:1353, static_pr:130, weight:"-" },
      { type:"IM 300 T4-2HP", supply:"415V, 3Ø, 50Hz", amps:3.2, watts:1500, rpm:1400, airflow_cmh:1700, airflow_cfm:1000, static_pr:55, weight:"-" },
      { type:"IM 300 T2-2HP", supply:"415V, 3Ø, 50Hz", amps:3.2, watts:1500, rpm:2800, airflow_cmh:3300, airflow_cfm:1941, static_pr:125, weight:"-" },
      { type:"IM 350-3HP", supply:"415V, 3Ø, 50Hz", amps:4.5, watts:2250, rpm:2800, airflow_cmh:4000, airflow_cfm:2353, static_pr:120, weight:"-" },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)"],
    images: [
      "/images/products/im250-t2-1.jpg",
      "/images/products/im250-t2-2.jpg",
      "/images/products/im250-t2-3.jpg",
      "/images/products/im250-t2-4.jpg",
      "/images/products/im250-t2-5.jpg"
    ],
        note: "Custom made. Motor HP Range 0.25HP to 12.5HP and above on special requirement. Static Pressure Range 20mm-wc to 300mm-wc. Air Volume 100 CMH to 20000 CMH. Tolerance ±5% on Specified values."
  },

  // ─── AXIAL FANS ──────────────────────────────────────────────────────────

  {
    id: "axial-fan-press-fit",
    category: "Axial Fans",
    name: "Axial Fan External Rotor Press Fit Impeller",
    models: ["CM 130","CM 150","CM 200","CM 250","CM 300","6AF","8AF","10AF","12AF"],
    description: "External rotor press fit impeller axial fans offering silent, compact and efficient air movement for HVAC, refrigeration and motor cooling.",
    applications: ["Refrigeration","Air Conditioning","Motor Cooling","HVAC","Condenser Cooling"],
    specs: [
      { type:"CM 130 S2/B2", supply:"230V, 1Ø, 50Hz", amps:0.15, watts:25, rpm:2850, airflow_cmh:300, airflow_cfm:176, static_pr:16, dba:50, cap_uf:1, fan_dia:128, height:65, amb_temp:60, weight:1.05 },
      { type:"CM 150 S2/B2", supply:"230V, 1Ø, 50Hz", amps:0.15, watts:30, rpm:2850, airflow_cmh:350, airflow_cfm:206, static_pr:20, dba:52, cap_uf:1.5, fan_dia:148, height:65, amb_temp:60, weight:1.05 },
      { type:"CM 200 S4/B4", supply:"230V, 1Ø, 50Hz", amps:0.25, watts:45, rpm:1400, airflow_cmh:425, airflow_cfm:250, static_pr:8, dba:50, cap_uf:1.5, fan_dia:197, height:78, amb_temp:60, weight:2.0 },
      { type:"CM 200 S2/B2", supply:"230V, 1Ø, 50Hz", amps:0.3, watts:60, rpm:2750, airflow_cmh:900, airflow_cfm:529, static_pr:26, dba:65, cap_uf:2, fan_dia:197, height:78, amb_temp:60, weight:2.25 },
      { type:"6AF 3S2/B2", supply:"415V, 3Ø, 50Hz", amps:0.17, watts:40, rpm:2880, airflow_cmh:350, airflow_cfm:206, static_pr:18, dba:60, fan_dia:148, height:78, amb_temp:60, weight:1.90 },
      { type:"8AF 3B4/S4", supply:"415V, 3Ø, 50Hz", amps:0.35, watts:50, rpm:1400, airflow_cmh:425, airflow_cfm:250, static_pr:8, dba:50, fan_dia:197, height:78, amb_temp:60, weight:2.0 },
      { type:"8AF 3B2/S2", supply:"415V, 3Ø, 50Hz", amps:0.2, watts:90, rpm:2800, airflow_cmh:900, airflow_cfm:529, static_pr:26, dba:65, fan_dia:197, height:78, amb_temp:60, weight:2.0 },
      { type:"CM 250 S4/B4", supply:"230V, 1Ø, 50Hz", amps:0.25, watts:65, rpm:1400, airflow_cmh:850, airflow_cfm:500, static_pr:10, dba:50, cap_uf:2.5, fan_dia:248, height:87, amb_temp:60, weight:2.25 },
      { type:"CM 250 S2/B2", supply:"230V, 1Ø, 50Hz", amps:0.6, watts:140, rpm:2600, airflow_cmh:1700, airflow_cfm:1000, static_pr:35, dba:72, cap_uf:3.15, fan_dia:248, height:87, amb_temp:60, weight:2.25 },
      { type:"10AF 3B2/S2", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:130, rpm:2650, airflow_cmh:1700, airflow_cfm:1000, static_pr:35, dba:72, fan_dia:248, height:87, amb_temp:60, weight:2.25 },
      { type:"10AF 3B4/S4", supply:"415V, 3Ø, 50Hz", amps:0.25, watts:80, rpm:1475, airflow_cmh:1000, airflow_cfm:588, static_pr:9, dba:50, fan_dia:248, height:87, amb_temp:60, weight:2.0 },
      { type:"CM 300 B4/S4", supply:"230V, 1Ø, 50Hz", amps:0.3, watts:75, rpm:1400, airflow_cmh:1750, airflow_cfm:1029, static_pr:12, dba:64, cap_uf:3.15, fan_dia:298, height:88, amb_temp:60, weight:2.5 },
      { type:"12AF 3B4/S4", supply:"415V, 3Ø, 50Hz", amps:0.30, watts:75, rpm:1350, airflow_cmh:1750, airflow_cfm:1029, static_pr:12, dba:64, fan_dia:298, height:88, amb_temp:60, weight:2.5 },
      { type:"CM 300 B2/S2", supply:"230V, 1Ø, 50Hz", amps:0.7, watts:165, rpm:2450, airflow_cmh:2300, airflow_cfm:1353, static_pr:20, dba:65, cap_uf:4, fan_dia:298, height:88, amb_temp:60, weight:2.5 },
      { type:"12AF 3B2/S2", supply:"415V, 3Ø, 50Hz", amps:0.30, watts:150, rpm:2450, airflow_cmh:2300, airflow_cfm:1353, static_pr:20, dba:73, fan_dia:298, height:88, amb_temp:60, weight:2.5 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Fan Dia D(mm)","Height H(mm)","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/cm-150-s2-1.jpg",
      "/images/products/cm-150-s2-2.jpg",
      "/images/products/cm-150-s2-3.jpg",
      "/images/products/10af-3s2-1.jpg",
      "/images/products/10af-3s2-2.jpg",
      "/images/products/10af-3s2-3.jpg",
      "/images/products/10af-3s2-4.jpg"
    ],
        note: "S = Suction type, B = Blowing type. Tolerance ±5% on Specified values."
  },

  {
    id: "axial-fan-riveted",
    category: "Axial Fans",
    name: "Axial Fan External Rotor Riveted Impeller",
    models: ["CM 350","CM 400","CM 450","14AF","16AF","18AF","20AF"],
    description: "Large diameter external rotor riveted impeller axial fans for heavy-duty industrial cooling and ventilation. Available with straight grill, basket grill or round casing.",
    applications: ["Industrial Cooling","Large HVAC","Forced Motor Cooling","Condenser Cooling"],
    specs: [
      { type:"CM 350 B4/S4", supply:"230V, 1Ø, 50Hz", amps:0.75, watts:165, rpm:1400, airflow_cmh:2900, airflow_cfm:1706, static_pr:22, dba:64, cap_uf:6, fan_dia:348, height:110, amb_temp:60, weight:4.0 },
      { type:"CM 400 B4/S4", supply:"230V, 1Ø, 50Hz", amps:1, watts:220, rpm:1350, airflow_cmh:4200, airflow_cfm:2471, static_pr:26, dba:69, cap_uf:6, fan_dia:398, height:120, amb_temp:60, weight:4.5 },
      { type:"CM 450 B4/S4", supply:"230V, 1Ø, 50Hz", amps:1.6, watts:350, rpm:1350, airflow_cmh:5800, airflow_cfm:3412, static_pr:28, dba:68, cap_uf:6, fan_dia:446, height:135, amb_temp:60, weight:5.8 },
      { type:"14AF 3B4/S4", supply:"415V, 3Ø, 50Hz", amps:0.4, watts:145, rpm:1400, airflow_cmh:2900, airflow_cfm:1706, static_pr:22, dba:64, fan_dia:348, height:110, amb_temp:60, weight:4.0 },
      { type:"16AF 3B4/S4", supply:"415V, 3Ø, 50Hz", amps:0.5, watts:220, rpm:1350, airflow_cmh:4200, airflow_cfm:2471, static_pr:26, dba:69, fan_dia:398, height:120, amb_temp:60, weight:4.5 },
      { type:"18AF 3B4/S4", supply:"415V, 3Ø, 50Hz", amps:0.6, watts:280, rpm:1350, airflow_cmh:5800, airflow_cfm:3412, static_pr:28, dba:68, fan_dia:446, height:135, amb_temp:60, weight:5.7 },
      { type:"20AF 3S4", supply:"415V, 3Ø, 50Hz", amps:0.85, watts:420, rpm:1350, airflow_cmh:6800, airflow_cfm:4000, static_pr:13, dba:70, fan_dia:496, height:125, amb_temp:60, weight:9.5 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Fan Dia D(mm)","Height H(mm)","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/10af-3b2-2.jpg",
      "/images/products/10af-3b2-3.jpg",
      "/images/products/10af-3b2-4.jpg",
      "/images/products/18af-3s4-1.jpg",
      "/images/products/18af-3s4-2.jpg",
      "/images/products/18af-3s4-3.jpg",
      "/images/products/18af-3s4-4.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "18af-3b4-bg",
    category: "Axial Fans",
    name: "18 Inch Axial Fan",
    models: ["18AF 3B4-BG"],
    description: "18 inch external rotor axial fan with basket grill, mild steel powder coated blade, and IP-54 ingress protection for industrial cooling and ventilation applications.",
    applications: ["Industrial Cooling","Ventilation","Condenser Cooling","HVAC"],
    specs: [
      { type:"18AF 3B4-BG", supply:"415V, 3Ø, 50Hz", amps:0.6, watts:280, rpm:1350, airflow_cmh:5800, airflow_cfm:3412, amb_temp:60, weight:5.7 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Admissible Ambient Temp °C","Weight Kg"],
    images: [
      "/images/products/18af-3b4-bg-new-1.png"
    ],
    note: "All dimensions are in mm. Fan blade is made of mild steel and powder coated. Ingress protection IP-54."
  },

  {
    id: "20af-3b4",
    category: "Axial Fans",
    name: "20 Inch Axial Fan",
    models: ["20 AF 3B4"],
    description: "20 inch axial fan for high-volume air movement, supplied in 415V three phase configuration with basket grill arrangement for industrial cooling and ventilation.",
    applications: ["Industrial Cooling","Ventilation","Condenser Cooling","HVAC"],
    specs: [
      { type:"20 AF 3B4", supply:"415V, 3Ø, 50Hz", amps:0.85, watts:420, rpm:1350, airflow_cmh:6800, airflow_cfm:4000, static_pr:13, dba:70, cap_uf:"—", amb_temp:60, weight:9.5 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Admissible Ambient Temp °C","Weight Kg"],
    images: [
      "/images/products/20af-3b4-new-1.png",
      "/images/products/20af-3b4-new-2.png"
    ],
    note: "All dimensions are in mm. Insulation class F. Ingress protection IP-54."
  },

  // ─── SPECIAL PURPOSE FANS ─────────────────────────────────────────────────

  {
    id: "inline-duct-fan",
    category: "Inline Duct Fans",
    name: "Inline Duct Fan",
    models: ["SID 100","SID 150","SID 200","SID 250"],
    description: "Compact inline duct fans for in-line ventilation in ducted systems. Ideal for bathroom, kitchen and industrial exhaust and supply applications.",
    applications: ["Duct Booster","Bathroom Exhaust","Kitchen Ventilation","Inline Ventilation"],
    specs: [
      { type:"SID 100 S2", supply:"230V, 1Ø, 50Hz", amps:0.35, watts:80, rpm:2600, airflow_cmh:300, airflow_cfm:176, static_pr:30, dba:52, cap_uf:2, amb_temp:60, weight:3.5 },
      { type:"SID 100 S4", supply:"230V, 1Ø, 50Hz", amps:0.3, watts:70, rpm:1400, airflow_cmh:175, airflow_cfm:103, static_pr:16, dba:52, cap_uf:2, amb_temp:60, weight:3.5 },
      { type:"SID 150 S2", supply:"230V, 1Ø, 50Hz", amps:0.45, watts:120, rpm:2600, airflow_cmh:650, airflow_cfm:382, static_pr:38, dba:54, cap_uf:2.5, amb_temp:60, weight:4.5 },
      { type:"SID 150 T2", supply:"415V, 3Ø, 50Hz", amps:0.17, watts:85, rpm:2600, airflow_cmh:650, airflow_cfm:382, static_pr:38, dba:56, cap_uf:"—", amb_temp:60, weight:4.5 },
      { type:"SID 200 S2", supply:"230V, 1Ø, 50Hz", amps:0.6, watts:150, rpm:2600, airflow_cmh:1100, airflow_cfm:647, static_pr:50, dba:60, cap_uf:4, amb_temp:60, weight:6.0 },
      { type:"SID 200 T2", supply:"415V, 3Ø, 50Hz", amps:0.3, watts:150, rpm:2500, airflow_cmh:1120, airflow_cfm:659, static_pr:50, dba:60, cap_uf:"—", amb_temp:60, weight:6.0 },
      { type:"SID 250 S2", supply:"230V, 1Ø, 50Hz", amps:0.65, watts:160, rpm:2650, airflow_cmh:1600, airflow_cfm:941, static_pr:55, dba:63, cap_uf:5, amb_temp:60, weight:6.0 },
      { type:"SID 250 T2", supply:"415V, 3Ø, 50Hz", amps:0.30, watts:155, rpm:2500, airflow_cmh:1500, airflow_cfm:882, static_pr:52, dba:62, cap_uf:"—", amb_temp:60, weight:6.2 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Airflow CFM","Static PR (mm-wc)","dBA","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sid-150-s2-1.jpg",
      "/images/products/sid-150-s2-2.jpg",
      "/images/products/sid-150-s2-3.jpg",
      "/images/products/sid-150-s2-4.jpg",
      "/images/products/sid-150-s2-5.jpg",
      "/images/products/sid-200-s2-1.jpg",
      "/images/products/sid-200-s2-2.jpg",
      "/images/products/sid-200-s2-3.jpg",
      "/images/products/sid-250-s2-1.jpg",
      "/images/products/sid-250-s2-2.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "cross-flow-fan",
    category: "Cross Flow Fans",
    name: "Cross Flow Fan",
    models: ["SCF 100"],
    description: "Cross flow fan providing uniform airflow across the full fan width. Ideal for air curtains, room air conditioners and display cabinets.",
    applications: ["Air Curtains","Room Air Conditioners","Display Cabinets","Uniform Air Distribution"],
    specs: [
      { type:"SCF 100 S4", supply:"230V, 1Ø, 50Hz", amps:0.20, watts:40, rpm:1400, airflow_cmh:510, airflow_cfm:"-", static_pr:18, dba:56, weight:4.5 },
    ],
    spec_columns: ["Type","I/P Supply","Amps (A)","Watts (W)","RPM","Airflow CMH","Static PR (mm-wc)","dBA","Weight Kg"],
    images: [
      "/images/products/scf-100-s4-1.jpg",
      "/images/products/scf-100-s4-2.jpg",
      "/images/products/scf-100-s4-3.jpg",
      "/images/products/scf-100-s4-4.jpg",
      "/images/products/scf-100-s4-5.jpg",
      "/images/products/scf-100-s4-6.jpg",
      "/images/products/scf-100-s4-7.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "fume-extractor",
    category: "Fume Extractors",
    name: "Fume Extractor",
    models: ["Fume Extractor"],
    description: "Industrial fume extractor with built-in gas filter and blower for welding fume removal, chemical fume extraction and clean air applications.",
    applications: ["Welding Fume Removal","Chemical Fume Extraction","Clean Room","Laboratory Exhaust"],
    specs: [
      { type:"Fume Extractor", voltage:230, phase:"1Ø", amps:0.70, watts:175, rpm:2600, airflow:"1450/853 CMH/CFM", static_pr:57, cap:"5µf", dba:60, amb_temp:"60°C" },
    ],
    spec_columns: ["Type","Voltage (V)","Phase","Current (A)","Watts (W)","RPM","Airflow CMH/CFM","Static PR (mm-wc)","Capacitor","dBA","Amb. Temp"],
    images: [
      "/images/products/fume-extractor-1.jpg",
      "/images/products/fume-extractor-2.jpg",
      "/images/products/fume-extractor-3.jpg"
    ],
        note: "Electrical and Flow Parameters can change depending on type of filter used."
  },

  // ─── MOTORS ──────────────────────────────────────────────────────────────

  {
    id: "induction-motors",
    category: "Motors",
    name: "Induction Motors",
    models: ["IM 390","IM 400","IM 23","IR 25","IR 35"],
    description: "High-quality induction motors for fan and blower applications. Available in single and three phase configurations.",
    applications: ["Fan Drives","Blower Drives","General Industrial","OEM Applications"],
    specs: [
      { type:"IM 390 S4", supply:"230V, 1Ø, 50Hz", amps_max:0.5, watts:150, rpm:1400, cap_uf:4, amb_temp:60, weight:6.0 },
      { type:"IM 390 T4", supply:"415V, 3Ø, 50Hz", amps_max:0.4, watts:150, rpm:1400, cap_uf:"—", amb_temp:60, weight:6.0 },
      { type:"IM 400 S4", supply:"230V, 1Ø, 50Hz", amps_max:0.65, watts:165, rpm:1450, cap_uf:3.15, amb_temp:60, weight:6.5 },
      { type:"IM 23 S4", supply:"230V, 1Ø, 50Hz", amps_max:3.0, watts:950, rpm:1450, cap_uf:12.5, amb_temp:60, weight:8.5 },
      { type:"IM 23 S2", supply:"230V, 1Ø, 50Hz", amps_max:7.0, watts:1500, rpm:2900, cap_uf:25, amb_temp:60, weight:8.2 },
      { type:"IR 25 SS", supply:"230V, 1Ø, 50Hz", amps_max:0.45, watts:90, rpm:2600, cap_uf:2, amb_temp:60, weight:2.2 },
      { type:"IR 35 SS", supply:"230V, 1Ø, 50Hz", amps_max:0.60, watts:120, rpm:2800, cap_uf:4, amb_temp:60, weight:3.2 },
    ],
    spec_columns: ["Type","I/P Supply","Amps max (A)","Full Load Watts (W)","RPM","CAP µf","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/im-390-t4-1.jpg",
      "/images/products/im-390-t4-2.jpg",
      "/images/products/im-390-t4-3.jpg",
      "/images/products/im-390-t4-4.jpg",
      "/images/products/ir-35-1.jpg",
      "/images/products/ir-35-2.jpg",
      "/images/products/ir-35-3.jpg",
      "/images/products/ir-35-4.jpg",
      "/images/products/ir-35-5.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  {
    id: "pump-motors",
    category: "Motors",
    name: "Pump Motors",
    models: ["S.M-1","S.M-2"],
    description: "High-speed pump motors for industrial pumping applications. Compact and robust design with carbon brush holder.",
    applications:["Industrial Pumps","High Speed Applications","OEM Drives"],
    specs: [
      { type:"S.M-1", supply:"230V, 1Ø, 50Hz", amps_max:0.90, watts_max:250, rpm:14000, dba:88, amb_temp:60, weight:3.6 },
      { type:"S.M-2", supply:"230V, 1Ø, 50Hz", amps_max:1.50, watts_max:350, rpm:16000, dba:88, amb_temp:60, weight:4.2 },
    ],
    spec_columns: ["Type","I/P Supply","Amps max (A)","Watts max (W)","RPM","dBA","Amb. Temp °C","Weight Kg"],
    images: [
      "/images/products/sm-2-1.jpg",
      "/images/products/sm-2-2.jpg",
      "/images/products/sm-2-3.jpg",
      "/images/products/sm-2-4.jpg",
      "/images/products/sm-2-5.jpg"
    ],
        note: "Tolerance ±5% on Specified values"
  },

  // ─── CUSTOMIZED / SPECIAL MODELS ─────────────────────────────────────────

  {
    id: "forced-motor-cooling",
    category: "Motor Cooling Units",
    name: "Forced Motor Cooling Units",
    models: ["Frames 63 to 400"],
    description: "Forced motor cooling units for all makes of motors. Frames 63 to 400. Custom built to suit motor dimensions and cooling requirements.",
    applications: ["Motor Cooling","Variable Frequency Drive Motors","Industrial Motors","Retrofit Cooling"],
    specs: [],
    spec_columns: [],
    images: [
      "/images/products/cm-150-s2---80-32--1.jpg",
      "/images/products/cm-150-s2---80-32--2.jpg",
      "/images/products/cm-150-s2---80-32--3.jpg",
      "/images/products/16af-3s4---frame-280hm-1.jpg",
      "/images/products/16af-3s4---frame-280hm-2.jpg",
      "/images/products/16af-3s4---frame-280hm-3.jpg"
    ],
        note: "Frames 63 to 400. Power Supply: 230V, 1Ø, 50Hz / 415V, 3Ø, 50Hz & Custom make. Contact us for specifications."
  },

  // ─── NEW DEVELOPMENT PRODUCTS ───────────────────────────────────────────

  {
    id: "belt-driven-blowers",
    category: "Belt Driven Blowers",
    name: "Belt-Driven Blowers",
    models: ["SBDB S2"],
    description: "Belt-driven blower arrangement for industrial air movement applications requiring robust construction, practical serviceability, and dependable airflow performance.",
    applications: ["Industrial Ventilation","Process Air Movement","Equipment Cooling","OEM Systems"],
    specs: [
      { type:"SBDB S2", supply:"230V, 1Ø, 50Hz", current:5.6, watts:1265, rpm:2800, airflow_cmh:6980, static_pr:23 },
    ],
    spec_columns: ["Type","I/P Supply","Current (A)","Power (W)","Speed (RPM)","Airflow (m3/h)","Static-PR (mmWc)"],
    images: [
      "/images/products/belt-driven-blowers-user.png"
    ],
    note: "New development product."
  },

  {
    id: "plug-fans",
    category: "Plug Fans",
    name: "Plug Fans",
    models: ["SPA-440-T2"],
    description: "Direct-driven plug aerofoil fan designed for high-efficiency air movement, reduced aerodynamic losses, low vibration, and reliable continuous-duty operation. The compact construction integrates easily into air handling and process cooling systems.",
    applications: ["Air Handling Units","Compressor Cooling","Clean Rooms","Data Centers","OEM Equipment","Process Ventilation"],
    specs: [
      { type:"SPA-440-T2", supply:"415V, 3Ø, 50Hz", current:6.9, watts:3700, rpm:2800, airflow_cmh:9500, static_pr:173 },
    ],
    spec_columns: ["Type","I/P Supply","Current (A)","Power (W)","Speed (RPM)","Airflow (m3/h)","Static-PR (mmWc)"],
    images: [
      "/images/products/plug-fans-user.png"
    ],
    note: "New development product with aerofoil impeller technology for smooth airflow and reduced transmission losses."
  },

  {
    id: "roof-top-fans",
    category: "Roof Top Fans",
    name: "Roof Top Fans",
    models: ["RTF 600 T4","RTF 450 S4","RTF 310 S4"],
    description: "High-performance roof top fans engineered for reliable extraction of hot air, fumes, smoke, and stale air from industrial, commercial, and institutional buildings. Weather-resistant construction supports continuous outdoor installation with low-noise operation and dependable airflow.",
    applications: ["Factory Roof Ventilation","Warehouses","Workshops","Manufacturing Plants","Industrial Exhaust"],
    specs: [
      { type:"RTF 600 T4", supply:"415V, 3Ø, 50Hz", current:2.0, watts:976, rpm:1450, airflow_cmh:8100, static_pr:86 },
      { type:"RTF 450 S4", supply:"230V, 1Ø, 50Hz", current:2.4, watts:520, rpm:1450, airflow_cmh:4205, static_pr:51 },
      { type:"RTF 310 S4", supply:"230V, 1Ø, 50Hz", current:1.8, watts:321, rpm:1450, airflow_cmh:2100, static_pr:23 },
    ],
    spec_columns: ["Type","I/P Supply","Current (A)","Power (W)","Speed (RPM)","Airflow (m3/h)","Static-PR (mmWc)"],
    images: [
      "/images/products/roof-top-fans-npd-1.png",
      "/images/products/roof-top-fans-npd-2.png",
      "/images/products/roof-top-fans-npd-3.png"
    ],
    note: "New development product. Product range can be customized to suit project-specific requirements."
  },

];

// Helper: get all unique categories
function getCategories() {
  return [...new Set(SEM_PRODUCTS.map(p => p.category))];
}

// Helper: get products by category
function getProductsByCategory(cat) {
  return SEM_PRODUCTS.filter(p => p.category === cat);
}

// Helper: get product by id
function getProductById(id) {
  return SEM_PRODUCTS.find(p => p.id === id);
}
