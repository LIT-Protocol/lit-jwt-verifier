var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/@noble/bls12-381/math.js
var require_math = __commonJS({
  "node_modules/@noble/bls12-381/math.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.psi2 = exports.psi = exports.millerLoop = exports.calcPairingPrecomputes = exports.isogenyMapG2 = exports.map_to_curve_simple_swu_9mod16 = exports.ProjectivePoint = exports.Fp12 = exports.Fp6 = exports.Fp2 = exports.Fr = exports.Fp = exports.powMod = exports.mod = exports.CURVE = void 0;
    exports.CURVE = {
      P: 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn,
      r: 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n,
      h: 0x396c8c005555e1568c00aaab0000aaabn,
      Gx: 0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bbn,
      Gy: 0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1n,
      b: 4n,
      P2: 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn ** 2n - 1n,
      h2: 0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5n,
      G2x: [
        0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8n,
        0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7en
      ],
      G2y: [
        0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801n,
        0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79ben
      ],
      b2: [4n, 4n],
      x: 0xd201000000010000n,
      h2Eff: 0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551n
    };
    var BLS_X_LEN = bitLen(exports.CURVE.x);
    function mod(a, b) {
      const res = a % b;
      return res >= 0n ? res : b + res;
    }
    exports.mod = mod;
    function powMod(a, power, modulo) {
      let res = 1n;
      while (power > 0n) {
        if (power & 1n)
          res = res * a % modulo;
        a = a * a % modulo;
        power >>= 1n;
      }
      return res;
    }
    exports.powMod = powMod;
    function genInvertBatch(cls, nums) {
      const len = nums.length;
      const scratch = new Array(len);
      let acc = cls.ONE;
      for (let i = 0; i < len; i++) {
        if (nums[i].isZero())
          continue;
        scratch[i] = acc;
        acc = acc.multiply(nums[i]);
      }
      acc = acc.invert();
      for (let i = len - 1; i >= 0; i--) {
        if (nums[i].isZero())
          continue;
        let tmp = acc.multiply(nums[i]);
        nums[i] = acc.multiply(scratch[i]);
        acc = tmp;
      }
      return nums;
    }
    function bitLen(n) {
      let len;
      for (len = 0; n > 0n; n >>= 1n, len += 1)
        ;
      return len;
    }
    function bitGet(n, pos) {
      return n >> BigInt(pos) & 1n;
    }
    function invert(number, modulo = exports.CURVE.P) {
      if (number === 0n || modulo <= 0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
      }
      let a = mod(number, modulo);
      let b = modulo;
      let [x, y, u, v] = [0n, 1n, 1n, 0n];
      while (a !== 0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        [b, a] = [a, r];
        [x, y] = [u, v];
        [u, v] = [m, n];
      }
      const gcd = b;
      if (gcd !== 1n)
        throw new Error("invert: does not exist");
      return mod(x, modulo);
    }
    var Fp = class {
      constructor(value) {
        this.value = mod(value, Fp.ORDER);
      }
      isZero() {
        return this.value === 0n;
      }
      equals(rhs) {
        return this.value === rhs.value;
      }
      negate() {
        return new Fp(-this.value);
      }
      invert() {
        return new Fp(invert(this.value, Fp.ORDER));
      }
      add(rhs) {
        return new Fp(this.value + rhs.value);
      }
      square() {
        return new Fp(this.value * this.value);
      }
      pow(n) {
        return new Fp(powMod(this.value, n, Fp.ORDER));
      }
      sqrt() {
        const root = this.pow((Fp.ORDER + 1n) / 4n);
        if (!root.square().equals(this))
          return;
        return root;
      }
      subtract(rhs) {
        return new Fp(this.value - rhs.value);
      }
      multiply(rhs) {
        if (rhs instanceof Fp)
          rhs = rhs.value;
        return new Fp(this.value * rhs);
      }
      div(rhs) {
        if (typeof rhs === "bigint")
          rhs = new Fp(rhs);
        return this.multiply(rhs.invert());
      }
      toString() {
        const str = this.value.toString(16).padStart(96, "0");
        return str.slice(0, 2) + "." + str.slice(-2);
      }
    };
    exports.Fp = Fp;
    Fp.ORDER = exports.CURVE.P;
    Fp.MAX_BITS = bitLen(exports.CURVE.P);
    Fp.ZERO = new Fp(0n);
    Fp.ONE = new Fp(1n);
    var Fr = class {
      constructor(value) {
        this.value = mod(value, Fr.ORDER);
      }
      static isValid(b) {
        return b <= Fr.ORDER;
      }
      isZero() {
        return this.value === 0n;
      }
      equals(rhs) {
        return this.value === rhs.value;
      }
      negate() {
        return new Fr(-this.value);
      }
      invert() {
        return new Fr(invert(this.value, Fr.ORDER));
      }
      add(rhs) {
        return new Fr(this.value + rhs.value);
      }
      square() {
        return new Fr(this.value * this.value);
      }
      pow(n) {
        return new Fr(powMod(this.value, n, Fr.ORDER));
      }
      subtract(rhs) {
        return new Fr(this.value - rhs.value);
      }
      multiply(rhs) {
        if (rhs instanceof Fr)
          rhs = rhs.value;
        return new Fr(this.value * rhs);
      }
      div(rhs) {
        if (typeof rhs === "bigint")
          rhs = new Fr(rhs);
        return this.multiply(rhs.invert());
      }
      legendre() {
        return this.pow((Fr.ORDER - 1n) / 2n);
      }
      sqrt() {
        if (!this.legendre().equals(Fr.ONE))
          return;
        const P = Fr.ORDER;
        let q, s, z;
        for (q = P - 1n, s = 0; q % 2n === 0n; q /= 2n, s++)
          ;
        if (s === 1)
          return this.pow((P + 1n) / 4n);
        for (z = 2n; z < P && new Fr(z).legendre().value !== P - 1n; z++)
          ;
        let c = powMod(z, q, P);
        let r = powMod(this.value, (q + 1n) / 2n, P);
        let t = powMod(this.value, q, P);
        let t2 = 0n;
        while (mod(t - 1n, P) !== 0n) {
          t2 = mod(t * t, P);
          let i;
          for (i = 1; i < s; i++) {
            if (mod(t2 - 1n, P) === 0n)
              break;
            t2 = mod(t2 * t2, P);
          }
          let b = powMod(c, BigInt(1 << s - i - 1), P);
          r = mod(r * b, P);
          c = mod(b * b, P);
          t = mod(t * c, P);
          s = i;
        }
        return new Fr(r);
      }
      toString() {
        return "0x" + this.value.toString(16).padStart(64, "0");
      }
    };
    exports.Fr = Fr;
    Fr.ORDER = exports.CURVE.r;
    Fr.ZERO = new Fr(0n);
    Fr.ONE = new Fr(1n);
    var FQP = class {
      zip(rhs, mapper) {
        const c0 = this.c;
        const c1 = rhs.c;
        const res = [];
        for (let i = 0; i < c0.length; i++) {
          res.push(mapper(c0[i], c1[i]));
        }
        return res;
      }
      map(callbackfn) {
        return this.c.map(callbackfn);
      }
      isZero() {
        return this.c.every((c) => c.isZero());
      }
      equals(rhs) {
        return this.zip(rhs, (left, right) => left.equals(right)).every((r) => r);
      }
      negate() {
        return this.init(this.map((c) => c.negate()));
      }
      add(rhs) {
        return this.init(this.zip(rhs, (left, right) => left.add(right)));
      }
      subtract(rhs) {
        return this.init(this.zip(rhs, (left, right) => left.subtract(right)));
      }
      conjugate() {
        return this.init([this.c[0], this.c[1].negate()]);
      }
      one() {
        const el = this;
        let one;
        if (el instanceof Fp2)
          one = Fp2.ONE;
        if (el instanceof Fp6)
          one = Fp6.ONE;
        if (el instanceof Fp12)
          one = Fp12.ONE;
        return one;
      }
      pow(n) {
        const elm = this;
        const one = this.one();
        if (n === 0n)
          return one;
        if (n === 1n)
          return elm;
        let p = one;
        let d = elm;
        while (n > 0n) {
          if (n & 1n)
            p = p.multiply(d);
          n >>= 1n;
          d = d.square();
        }
        return p;
      }
      div(rhs) {
        const inv = typeof rhs === "bigint" ? new Fp(rhs).invert().value : rhs.invert();
        return this.multiply(inv);
      }
    };
    var Fp2 = class extends FQP {
      constructor(coeffs) {
        super();
        if (coeffs.length !== 2)
          throw new Error(`Expected array with 2 elements`);
        coeffs.forEach((c, i) => {
          if (typeof c === "bigint")
            coeffs[i] = new Fp(c);
        });
        this.c = coeffs;
      }
      init(tuple) {
        return new Fp2(tuple);
      }
      toString() {
        return `Fp2(${this.c[0]} + ${this.c[1]}\xD7i)`;
      }
      get values() {
        return this.c.map((c) => c.value);
      }
      multiply(rhs) {
        if (typeof rhs === "bigint")
          return new Fp2(this.map((c) => c.multiply(rhs)));
        const [c0, c1] = this.c;
        const [r0, r1] = rhs.c;
        let t1 = c0.multiply(r0);
        let t2 = c1.multiply(r1);
        return new Fp2([t1.subtract(t2), c0.add(c1).multiply(r0.add(r1)).subtract(t1.add(t2))]);
      }
      mulByNonresidue() {
        const c0 = this.c[0];
        const c1 = this.c[1];
        return new Fp2([c0.subtract(c1), c0.add(c1)]);
      }
      square() {
        const c0 = this.c[0];
        const c1 = this.c[1];
        const a = c0.add(c1);
        const b = c0.subtract(c1);
        const c = c0.add(c0);
        return new Fp2([a.multiply(b), c.multiply(c1)]);
      }
      sqrt() {
        const candidateSqrt = this.pow((Fp2.ORDER + 8n) / 16n);
        const check = candidateSqrt.square().div(this);
        const R = FP2_ROOTS_OF_UNITY;
        const divisor = [R[0], R[2], R[4], R[6]].find((r) => r.equals(check));
        if (!divisor)
          return;
        const index = R.indexOf(divisor);
        const root = R[index / 2];
        if (!root)
          throw new Error("Invalid root");
        const x1 = candidateSqrt.div(root);
        const x2 = x1.negate();
        const [re1, im1] = x1.values;
        const [re2, im2] = x2.values;
        if (im1 > im2 || im1 === im2 && re1 > re2)
          return x1;
        return x2;
      }
      invert() {
        const [a, b] = this.values;
        const factor = new Fp(a * a + b * b).invert();
        return new Fp2([factor.multiply(new Fp(a)), factor.multiply(new Fp(-b))]);
      }
      frobeniusMap(power) {
        return new Fp2([this.c[0], this.c[1].multiply(FP2_FROBENIUS_COEFFICIENTS[power % 2])]);
      }
      multiplyByB() {
        let [c0, c1] = this.c;
        let t0 = c0.multiply(4n);
        let t1 = c1.multiply(4n);
        return new Fp2([t0.subtract(t1), t0.add(t1)]);
      }
    };
    exports.Fp2 = Fp2;
    Fp2.ORDER = exports.CURVE.P2;
    Fp2.MAX_BITS = bitLen(exports.CURVE.P2);
    Fp2.ZERO = new Fp2([0n, 0n]);
    Fp2.ONE = new Fp2([1n, 0n]);
    var Fp6 = class extends FQP {
      constructor(c) {
        super();
        this.c = c;
        if (c.length !== 3)
          throw new Error(`Expected array with 3 elements`);
      }
      static fromTuple(t) {
        if (!Array.isArray(t) || t.length !== 6)
          throw new Error("Invalid Fp6 usage");
        return new Fp6([new Fp2(t.slice(0, 2)), new Fp2(t.slice(2, 4)), new Fp2(t.slice(4, 6))]);
      }
      init(triple) {
        return new Fp6(triple);
      }
      toString() {
        return `Fp6(${this.c[0]} + ${this.c[1]} * v, ${this.c[2]} * v^2)`;
      }
      conjugate() {
        throw new TypeError("No conjugate on Fp6");
      }
      multiply(rhs) {
        if (typeof rhs === "bigint")
          return new Fp6([this.c[0].multiply(rhs), this.c[1].multiply(rhs), this.c[2].multiply(rhs)]);
        let [c0, c1, c2] = this.c;
        const [r0, r1, r2] = rhs.c;
        let t0 = c0.multiply(r0);
        let t1 = c1.multiply(r1);
        let t2 = c2.multiply(r2);
        return new Fp6([
          t0.add(c1.add(c2).multiply(r1.add(r2)).subtract(t1.add(t2)).mulByNonresidue()),
          c0.add(c1).multiply(r0.add(r1)).subtract(t0.add(t1)).add(t2.mulByNonresidue()),
          t1.add(c0.add(c2).multiply(r0.add(r2)).subtract(t0.add(t2)))
        ]);
      }
      mulByNonresidue() {
        return new Fp6([this.c[2].mulByNonresidue(), this.c[0], this.c[1]]);
      }
      multiplyBy1(b1) {
        return new Fp6([
          this.c[2].multiply(b1).mulByNonresidue(),
          this.c[0].multiply(b1),
          this.c[1].multiply(b1)
        ]);
      }
      multiplyBy01(b0, b1) {
        let [c0, c1, c2] = this.c;
        let t0 = c0.multiply(b0);
        let t1 = c1.multiply(b1);
        return new Fp6([
          c1.add(c2).multiply(b1).subtract(t1).mulByNonresidue().add(t0),
          b0.add(b1).multiply(c0.add(c1)).subtract(t0).subtract(t1),
          c0.add(c2).multiply(b0).subtract(t0).add(t1)
        ]);
      }
      multiplyByFp2(rhs) {
        return new Fp6(this.map((c) => c.multiply(rhs)));
      }
      square() {
        let [c0, c1, c2] = this.c;
        let t0 = c0.square();
        let t1 = c0.multiply(c1).multiply(2n);
        let t3 = c1.multiply(c2).multiply(2n);
        let t4 = c2.square();
        return new Fp6([
          t3.mulByNonresidue().add(t0),
          t4.mulByNonresidue().add(t1),
          t1.add(c0.subtract(c1).add(c2).square()).add(t3).subtract(t0).subtract(t4)
        ]);
      }
      invert() {
        let [c0, c1, c2] = this.c;
        let t0 = c0.square().subtract(c2.multiply(c1).mulByNonresidue());
        let t1 = c2.square().mulByNonresidue().subtract(c0.multiply(c1));
        let t2 = c1.square().subtract(c0.multiply(c2));
        let t4 = c2.multiply(t1).add(c1.multiply(t2)).mulByNonresidue().add(c0.multiply(t0)).invert();
        return new Fp6([t4.multiply(t0), t4.multiply(t1), t4.multiply(t2)]);
      }
      frobeniusMap(power) {
        return new Fp6([
          this.c[0].frobeniusMap(power),
          this.c[1].frobeniusMap(power).multiply(FP6_FROBENIUS_COEFFICIENTS_1[power % 6]),
          this.c[2].frobeniusMap(power).multiply(FP6_FROBENIUS_COEFFICIENTS_2[power % 6])
        ]);
      }
    };
    exports.Fp6 = Fp6;
    Fp6.ZERO = new Fp6([Fp2.ZERO, Fp2.ZERO, Fp2.ZERO]);
    Fp6.ONE = new Fp6([Fp2.ONE, Fp2.ZERO, Fp2.ZERO]);
    var Fp12 = class extends FQP {
      constructor(c) {
        super();
        this.c = c;
        if (c.length !== 2)
          throw new Error(`Expected array with 2 elements`);
      }
      static fromTuple(t) {
        return new Fp12([
          Fp6.fromTuple(t.slice(0, 6)),
          Fp6.fromTuple(t.slice(6, 12))
        ]);
      }
      init(c) {
        return new Fp12(c);
      }
      toString() {
        return `Fp12(${this.c[0]} + ${this.c[1]} * w)`;
      }
      multiply(rhs) {
        if (typeof rhs === "bigint")
          return new Fp12([this.c[0].multiply(rhs), this.c[1].multiply(rhs)]);
        let [c0, c1] = this.c;
        const [r0, r1] = rhs.c;
        let t1 = c0.multiply(r0);
        let t2 = c1.multiply(r1);
        return new Fp12([
          t1.add(t2.mulByNonresidue()),
          c0.add(c1).multiply(r0.add(r1)).subtract(t1.add(t2))
        ]);
      }
      multiplyBy014(o0, o1, o4) {
        let [c0, c1] = this.c;
        let [t0, t1] = [c0.multiplyBy01(o0, o1), c1.multiplyBy1(o4)];
        return new Fp12([
          t1.mulByNonresidue().add(t0),
          c1.add(c0).multiplyBy01(o0, o1.add(o4)).subtract(t0).subtract(t1)
        ]);
      }
      multiplyByFp2(rhs) {
        return this.init(this.map((c) => c.multiplyByFp2(rhs)));
      }
      square() {
        let [c0, c1] = this.c;
        let ab = c0.multiply(c1);
        return new Fp12([
          c1.mulByNonresidue().add(c0).multiply(c0.add(c1)).subtract(ab).subtract(ab.mulByNonresidue()),
          ab.add(ab)
        ]);
      }
      invert() {
        let [c0, c1] = this.c;
        let t = c0.square().subtract(c1.square().mulByNonresidue()).invert();
        return new Fp12([c0.multiply(t), c1.multiply(t).negate()]);
      }
      frobeniusMap(power) {
        const [c0, c1] = this.c;
        let r0 = c0.frobeniusMap(power);
        let [c1_0, c1_1, c1_2] = c1.frobeniusMap(power).c;
        const coeff = FP12_FROBENIUS_COEFFICIENTS[power % 12];
        return new Fp12([
          r0,
          new Fp6([c1_0.multiply(coeff), c1_1.multiply(coeff), c1_2.multiply(coeff)])
        ]);
      }
      Fp4Square(a, b) {
        const a2 = a.square(), b2 = b.square();
        return [
          b2.mulByNonresidue().add(a2),
          a.add(b).square().subtract(a2).subtract(b2)
        ];
      }
      cyclotomicSquare() {
        const [c0, c1] = this.c;
        const [c0c0, c0c1, c0c2] = c0.c;
        const [c1c0, c1c1, c1c2] = c1.c;
        let [t3, t4] = this.Fp4Square(c0c0, c1c1);
        let [t5, t6] = this.Fp4Square(c1c0, c0c2);
        let [t7, t8] = this.Fp4Square(c0c1, c1c2);
        let t9 = t8.mulByNonresidue();
        return new Fp12([
          new Fp6([
            t3.subtract(c0c0).multiply(2n).add(t3),
            t5.subtract(c0c1).multiply(2n).add(t5),
            t7.subtract(c0c2).multiply(2n).add(t7)
          ]),
          new Fp6([
            t9.add(c1c0).multiply(2n).add(t9),
            t4.add(c1c1).multiply(2n).add(t4),
            t6.add(c1c2).multiply(2n).add(t6)
          ])
        ]);
      }
      cyclotomicExp(n) {
        let z = Fp12.ONE;
        for (let i = BLS_X_LEN - 1; i >= 0; i--) {
          z = z.cyclotomicSquare();
          if (bitGet(n, i))
            z = z.multiply(this);
        }
        return z;
      }
      finalExponentiate() {
        const { x } = exports.CURVE;
        const t0 = this.frobeniusMap(6).div(this);
        const t1 = t0.frobeniusMap(2).multiply(t0);
        const t2 = t1.cyclotomicExp(x).conjugate();
        const t3 = t1.cyclotomicSquare().conjugate().multiply(t2);
        const t4 = t3.cyclotomicExp(x).conjugate();
        const t5 = t4.cyclotomicExp(x).conjugate();
        const t6 = t5.cyclotomicExp(x).conjugate().multiply(t2.cyclotomicSquare());
        const t7 = t6.cyclotomicExp(x).conjugate();
        const t2_t5_pow_q2 = t2.multiply(t5).frobeniusMap(2);
        const t4_t1_pow_q3 = t4.multiply(t1).frobeniusMap(3);
        const t6_t1c_pow_q1 = t6.multiply(t1.conjugate()).frobeniusMap(1);
        const t7_t3c_t1 = t7.multiply(t3.conjugate()).multiply(t1);
        return t2_t5_pow_q2.multiply(t4_t1_pow_q3).multiply(t6_t1c_pow_q1).multiply(t7_t3c_t1);
      }
    };
    exports.Fp12 = Fp12;
    Fp12.ZERO = new Fp12([Fp6.ZERO, Fp6.ZERO]);
    Fp12.ONE = new Fp12([Fp6.ONE, Fp6.ZERO]);
    var ProjectivePoint = class {
      constructor(x, y, z, C) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.C = C;
      }
      isZero() {
        return this.z.isZero();
      }
      createPoint(x, y, z) {
        return new this.constructor(x, y, z);
      }
      getZero() {
        return this.createPoint(this.C.ONE, this.C.ONE, this.C.ZERO);
      }
      equals(rhs) {
        if (this.constructor !== rhs.constructor)
          throw new Error(`ProjectivePoint#equals: this is ${this.constructor}, but rhs is ${rhs.constructor}`);
        const a = this;
        const b = rhs;
        const xe = a.x.multiply(b.z).equals(b.x.multiply(a.z));
        const ye = a.y.multiply(b.z).equals(b.y.multiply(a.z));
        return xe && ye;
      }
      negate() {
        return this.createPoint(this.x, this.y.negate(), this.z);
      }
      toString(isAffine = true) {
        if (!isAffine) {
          return `Point<x=${this.x}, y=${this.y}, z=${this.z}>`;
        }
        const [x, y] = this.toAffine();
        return `Point<x=${x}, y=${y}>`;
      }
      fromAffineTuple(xy) {
        return this.createPoint(xy[0], xy[1], this.C.ONE);
      }
      toAffine(invZ = this.z.invert()) {
        return [this.x.multiply(invZ), this.y.multiply(invZ)];
      }
      toAffineBatch(points) {
        const toInv = genInvertBatch(this.C, points.map((p) => p.z));
        return points.map((p, i) => p.toAffine(toInv[i]));
      }
      normalizeZ(points) {
        return this.toAffineBatch(points).map((t) => this.fromAffineTuple(t));
      }
      double() {
        const { x, y, z } = this;
        const W = x.multiply(x).multiply(3n);
        const S = y.multiply(z);
        const SS = S.multiply(S);
        const SSS = SS.multiply(S);
        const B = x.multiply(y).multiply(S);
        const H = W.multiply(W).subtract(B.multiply(8n));
        const X3 = H.multiply(S).multiply(2n);
        const Y3 = W.multiply(B.multiply(4n).subtract(H)).subtract(y.multiply(y).multiply(8n).multiply(SS));
        const Z3 = SSS.multiply(8n);
        return this.createPoint(X3, Y3, Z3);
      }
      add(rhs) {
        if (this.constructor !== rhs.constructor)
          throw new Error(`ProjectivePoint#add: this is ${this.constructor}, but rhs is ${rhs.constructor}`);
        const p1 = this;
        const p2 = rhs;
        if (p1.isZero())
          return p2;
        if (p2.isZero())
          return p1;
        const X1 = p1.x;
        const Y1 = p1.y;
        const Z1 = p1.z;
        const X2 = p2.x;
        const Y2 = p2.y;
        const Z2 = p2.z;
        const U1 = Y2.multiply(Z1);
        const U2 = Y1.multiply(Z2);
        const V1 = X2.multiply(Z1);
        const V2 = X1.multiply(Z2);
        if (V1.equals(V2) && U1.equals(U2))
          return this.double();
        if (V1.equals(V2))
          return this.getZero();
        const U = U1.subtract(U2);
        const V = V1.subtract(V2);
        const VV = V.multiply(V);
        const VVV = VV.multiply(V);
        const V2VV = V2.multiply(VV);
        const W = Z1.multiply(Z2);
        const A = U.multiply(U).multiply(W).subtract(VVV).subtract(V2VV.multiply(2n));
        const X3 = V.multiply(A);
        const Y3 = U.multiply(V2VV.subtract(A)).subtract(VVV.multiply(U2));
        const Z3 = VVV.multiply(W);
        return this.createPoint(X3, Y3, Z3);
      }
      subtract(rhs) {
        if (this.constructor !== rhs.constructor)
          throw new Error(`ProjectivePoint#subtract: this is ${this.constructor}, but rhs is ${rhs.constructor}`);
        return this.add(rhs.negate());
      }
      validateScalar(n) {
        if (typeof n === "number")
          n = BigInt(n);
        if (typeof n !== "bigint" || n <= 0 || n > exports.CURVE.r) {
          throw new Error(`Point#multiply: invalid scalar, expected positive integer < CURVE.r. Got: ${n}`);
        }
        return n;
      }
      multiplyUnsafe(scalar) {
        let n = this.validateScalar(scalar);
        let point = this.getZero();
        let d = this;
        while (n > 0n) {
          if (n & 1n)
            point = point.add(d);
          d = d.double();
          n >>= 1n;
        }
        return point;
      }
      multiply(scalar) {
        let n = this.validateScalar(scalar);
        let point = this.getZero();
        let fake = this.getZero();
        let d = this;
        let bits = Fp.ORDER;
        while (bits > 0n) {
          if (n & 1n) {
            point = point.add(d);
          } else {
            fake = fake.add(d);
          }
          d = d.double();
          n >>= 1n;
          bits >>= 1n;
        }
        return point;
      }
      maxBits() {
        return this.C.MAX_BITS;
      }
      precomputeWindow(W) {
        const windows = Math.ceil(this.maxBits() / W);
        const windowSize = 2 ** (W - 1);
        let points = [];
        let p = this;
        let base3 = p;
        for (let window = 0; window < windows; window++) {
          base3 = p;
          points.push(base3);
          for (let i = 1; i < windowSize; i++) {
            base3 = base3.add(p);
            points.push(base3);
          }
          p = base3.double();
        }
        return points;
      }
      calcMultiplyPrecomputes(W) {
        if (this._MPRECOMPUTES)
          throw new Error("This point already has precomputes");
        this._MPRECOMPUTES = [W, this.normalizeZ(this.precomputeWindow(W))];
      }
      clearMultiplyPrecomputes() {
        this._MPRECOMPUTES = void 0;
      }
      wNAF(n) {
        let W, precomputes;
        if (this._MPRECOMPUTES) {
          [W, precomputes] = this._MPRECOMPUTES;
        } else {
          W = 1;
          precomputes = this.precomputeWindow(W);
        }
        let [p, f] = [this.getZero(), this.getZero()];
        const windows = Math.ceil(this.maxBits() / W);
        const windowSize = 2 ** (W - 1);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window = 0; window < windows; window++) {
          const offset = window * windowSize;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += 1n;
          }
          if (wbits === 0) {
            f = f.add(window % 2 ? precomputes[offset].negate() : precomputes[offset]);
          } else {
            const cached = precomputes[offset + Math.abs(wbits) - 1];
            p = p.add(wbits < 0 ? cached.negate() : cached);
          }
        }
        return [p, f];
      }
      multiplyPrecomputed(scalar) {
        return this.wNAF(this.validateScalar(scalar))[0];
      }
    };
    exports.ProjectivePoint = ProjectivePoint;
    function sgn0(x) {
      const [x0, x1] = x.values;
      const sign_0 = x0 % 2n;
      const zero_0 = x0 === 0n;
      const sign_1 = x1 % 2n;
      return BigInt(sign_0 || zero_0 && sign_1);
    }
    var P_MINUS_9_DIV_16 = (exports.CURVE.P ** 2n - 9n) / 16n;
    function sqrt_div_fp2(u, v) {
      const v7 = v.pow(7n);
      const uv7 = u.multiply(v7);
      const uv15 = uv7.multiply(v7.multiply(v));
      const gamma = uv15.pow(P_MINUS_9_DIV_16).multiply(uv7);
      let success = false;
      let result = gamma;
      const positiveRootsOfUnity = FP2_ROOTS_OF_UNITY.slice(0, 4);
      for (const root of positiveRootsOfUnity) {
        const candidate = root.multiply(gamma);
        if (candidate.pow(2n).multiply(v).subtract(u).isZero() && !success) {
          success = true;
          result = candidate;
        }
      }
      return [success, result];
    }
    function map_to_curve_simple_swu_9mod16(t) {
      const iso_3_a = new Fp2([0n, 240n]);
      const iso_3_b = new Fp2([1012n, 1012n]);
      const iso_3_z = new Fp2([-2n, -1n]);
      if (Array.isArray(t))
        t = new Fp2(t);
      const t2 = t.pow(2n);
      const iso_3_z_t2 = iso_3_z.multiply(t2);
      const ztzt = iso_3_z_t2.add(iso_3_z_t2.pow(2n));
      let denominator = iso_3_a.multiply(ztzt).negate();
      let numerator = iso_3_b.multiply(ztzt.add(Fp2.ONE));
      if (denominator.isZero())
        denominator = iso_3_z.multiply(iso_3_a);
      let v = denominator.pow(3n);
      let u = numerator.pow(3n).add(iso_3_a.multiply(numerator).multiply(denominator.pow(2n))).add(iso_3_b.multiply(v));
      const [success, sqrtCandidateOrGamma] = sqrt_div_fp2(u, v);
      let y;
      if (success)
        y = sqrtCandidateOrGamma;
      const sqrtCandidateX1 = sqrtCandidateOrGamma.multiply(t.pow(3n));
      u = iso_3_z_t2.pow(3n).multiply(u);
      let success2 = false;
      for (const eta of FP2_ETAs) {
        const etaSqrtCandidate = eta.multiply(sqrtCandidateX1);
        const temp = etaSqrtCandidate.pow(2n).multiply(v).subtract(u);
        if (temp.isZero() && !success && !success2) {
          y = etaSqrtCandidate;
          success2 = true;
        }
      }
      if (!success && !success2)
        throw new Error("Hash to Curve - Optimized SWU failure");
      if (success2)
        numerator = numerator.multiply(iso_3_z_t2);
      y = y;
      if (sgn0(t) !== sgn0(y))
        y = y.negate();
      y = y.multiply(denominator);
      return [numerator, y, denominator];
    }
    exports.map_to_curve_simple_swu_9mod16 = map_to_curve_simple_swu_9mod16;
    function isogenyMapG2(xyz) {
      const [x, y, z] = xyz;
      const zz = z.multiply(z);
      const zzz = zz.multiply(z);
      const zPowers = [z, zz, zzz];
      const mapped = [Fp2.ZERO, Fp2.ZERO, Fp2.ZERO, Fp2.ZERO];
      for (let i = 0; i < ISOGENY_COEFFICIENTS.length; i++) {
        const k_i = ISOGENY_COEFFICIENTS[i];
        mapped[i] = k_i.slice(-1)[0];
        const arr = k_i.slice(0, -1).reverse();
        for (let j = 0; j < arr.length; j++) {
          const k_i_j = arr[j];
          mapped[i] = mapped[i].multiply(x).add(zPowers[j].multiply(k_i_j));
        }
      }
      mapped[2] = mapped[2].multiply(y);
      mapped[3] = mapped[3].multiply(z);
      const z2 = mapped[1].multiply(mapped[3]);
      const x2 = mapped[0].multiply(mapped[3]);
      const y2 = mapped[1].multiply(mapped[2]);
      return [x2, y2, z2];
    }
    exports.isogenyMapG2 = isogenyMapG2;
    function calcPairingPrecomputes(x, y) {
      const [Qx, Qy, Qz] = [x, y, Fp2.ONE];
      let [Rx, Ry, Rz] = [Qx, Qy, Qz];
      let ell_coeff = [];
      for (let i = BLS_X_LEN - 2; i >= 0; i--) {
        let t0 = Ry.square();
        let t1 = Rz.square();
        let t2 = t1.multiply(3n).multiplyByB();
        let t3 = t2.multiply(3n);
        let t4 = Ry.add(Rz).square().subtract(t1).subtract(t0);
        ell_coeff.push([
          t2.subtract(t0),
          Rx.square().multiply(3n),
          t4.negate()
        ]);
        Rx = t0.subtract(t3).multiply(Rx).multiply(Ry).div(2n);
        Ry = t0.add(t3).div(2n).square().subtract(t2.square().multiply(3n));
        Rz = t0.multiply(t4);
        if (bitGet(exports.CURVE.x, i)) {
          let t02 = Ry.subtract(Qy.multiply(Rz));
          let t12 = Rx.subtract(Qx.multiply(Rz));
          ell_coeff.push([
            t02.multiply(Qx).subtract(t12.multiply(Qy)),
            t02.negate(),
            t12
          ]);
          let t22 = t12.square();
          let t32 = t22.multiply(t12);
          let t42 = t22.multiply(Rx);
          let t5 = t32.subtract(t42.multiply(2n)).add(t02.square().multiply(Rz));
          Rx = t12.multiply(t5);
          Ry = t42.subtract(t5).multiply(t02).subtract(t32.multiply(Ry));
          Rz = Rz.multiply(t32);
        }
      }
      return ell_coeff;
    }
    exports.calcPairingPrecomputes = calcPairingPrecomputes;
    function millerLoop(ell, g1) {
      let f12 = Fp12.ONE;
      const [x, y] = g1;
      const [Px, Py] = [x, y];
      for (let j = 0, i = BLS_X_LEN - 2; i >= 0; i--, j++) {
        f12 = f12.multiplyBy014(ell[j][0], ell[j][1].multiply(Px.value), ell[j][2].multiply(Py.value));
        if (bitGet(exports.CURVE.x, i)) {
          j += 1;
          f12 = f12.multiplyBy014(ell[j][0], ell[j][1].multiply(Px.value), ell[j][2].multiply(Py.value));
        }
        if (i !== 0)
          f12 = f12.square();
      }
      return f12.conjugate();
    }
    exports.millerLoop = millerLoop;
    var ut_root = new Fp6([Fp2.ZERO, Fp2.ONE, Fp2.ZERO]);
    var wsq = new Fp12([ut_root, Fp6.ZERO]);
    var wsq_inv = wsq.invert();
    var wcu = new Fp12([Fp6.ZERO, ut_root]);
    var wcu_inv = wcu.invert();
    function psi(x, y) {
      const x2 = wsq_inv.multiplyByFp2(x).frobeniusMap(1).multiply(wsq).c[0].c[0];
      const y2 = wcu_inv.multiplyByFp2(y).frobeniusMap(1).multiply(wcu).c[0].c[0];
      return [x2, y2];
    }
    exports.psi = psi;
    function psi2(x, y) {
      return [x.multiply(PSI2_C1), y.negate()];
    }
    exports.psi2 = psi2;
    var PSI2_C1 = 0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaacn;
    var rv1 = 0x6af0e0437ff400b6831e36d6bd17ffe48395dabc2d3435e77f76e17009241c5ee67992f72ec05f4c81084fbede3cc09n;
    var ev1 = 0x699be3b8c6870965e5bf892ad5d2cc7b0e85a117402dfd83b7f4a947e02d978498255a2aaec0ac627b5afbdf1bf1c90n;
    var ev2 = 0x8157cd83046453f5dd0972b6e3949e4288020b5b8a9cc99ca07e27089a2ce2436d965026adad3ef7baba37f2183e9b5n;
    var ev3 = 0xab1c2ffdd6c253ca155231eb3e71ba044fd562f6f72bc5bad5ec46a0b7a3b0247cf08ce6c6317f40edbc653a72dee17n;
    var ev4 = 0xaa404866706722864480885d68ad0ccac1967c7544b447873cc37e0181271e006df72162a3d3e0287bf597fbf7f8fc1n;
    var FP2_FROBENIUS_COEFFICIENTS = [
      0x1n,
      0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaan
    ].map((item) => new Fp(item));
    var FP2_ROOTS_OF_UNITY = [
      [1n, 0n],
      [rv1, -rv1],
      [0n, 1n],
      [rv1, rv1],
      [-1n, 0n],
      [-rv1, rv1],
      [0n, -1n],
      [-rv1, -rv1]
    ].map((pair) => new Fp2(pair));
    var FP2_ETAs = [
      [ev1, ev2],
      [-ev2, ev1],
      [ev3, ev4],
      [-ev4, ev3]
    ].map((pair) => new Fp2(pair));
    var FP6_FROBENIUS_COEFFICIENTS_1 = [
      [0x1n, 0x0n],
      [
        0x0n,
        0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaacn
      ],
      [
        0x00000000000000005f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffen,
        0x0n
      ],
      [0x0n, 0x1n],
      [
        0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaacn,
        0x0n
      ],
      [
        0x0n,
        0x00000000000000005f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffen
      ]
    ].map((pair) => new Fp2(pair));
    var FP6_FROBENIUS_COEFFICIENTS_2 = [
      [0x1n, 0x0n],
      [
        0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaadn,
        0x0n
      ],
      [
        0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaacn,
        0x0n
      ],
      [
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaan,
        0x0n
      ],
      [
        0x00000000000000005f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffen,
        0x0n
      ],
      [
        0x00000000000000005f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffeffffn,
        0x0n
      ]
    ].map((pair) => new Fp2(pair));
    var FP12_FROBENIUS_COEFFICIENTS = [
      [0x1n, 0x0n],
      [
        0x1904d3bf02bb0667c231beb4202c0d1f0fd603fd3cbd5f4f7b2443d784bab9c4f67ea53d63e7813d8d0775ed92235fb8n,
        0x00fc3e2b36c4e03288e9e902231f9fb854a14787b6c7b36fec0c8ec971f63c5f282d5ac14d6c7ec22cf78a126ddc4af3n
      ],
      [
        0x00000000000000005f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffeffffn,
        0x0n
      ],
      [
        0x135203e60180a68ee2e9c448d77a2cd91c3dedd930b1cf60ef396489f61eb45e304466cf3e67fa0af1ee7b04121bdea2n,
        0x06af0e0437ff400b6831e36d6bd17ffe48395dabc2d3435e77f76e17009241c5ee67992f72ec05f4c81084fbede3cc09n
      ],
      [
        0x00000000000000005f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffen,
        0x0n
      ],
      [
        0x144e4211384586c16bd3ad4afa99cc9170df3560e77982d0db45f3536814f0bd5871c1908bd478cd1ee605167ff82995n,
        0x05b2cfd9013a5fd8df47fa6b48b1e045f39816240c0b8fee8beadf4d8e9c0566c63a3e6e257f87329b18fae980078116n
      ],
      [
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaan,
        0x0n
      ],
      [
        0x00fc3e2b36c4e03288e9e902231f9fb854a14787b6c7b36fec0c8ec971f63c5f282d5ac14d6c7ec22cf78a126ddc4af3n,
        0x1904d3bf02bb0667c231beb4202c0d1f0fd603fd3cbd5f4f7b2443d784bab9c4f67ea53d63e7813d8d0775ed92235fb8n
      ],
      [
        0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaacn,
        0x0n
      ],
      [
        0x06af0e0437ff400b6831e36d6bd17ffe48395dabc2d3435e77f76e17009241c5ee67992f72ec05f4c81084fbede3cc09n,
        0x135203e60180a68ee2e9c448d77a2cd91c3dedd930b1cf60ef396489f61eb45e304466cf3e67fa0af1ee7b04121bdea2n
      ],
      [
        0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaadn,
        0x0n
      ],
      [
        0x05b2cfd9013a5fd8df47fa6b48b1e045f39816240c0b8fee8beadf4d8e9c0566c63a3e6e257f87329b18fae980078116n,
        0x144e4211384586c16bd3ad4afa99cc9170df3560e77982d0db45f3536814f0bd5871c1908bd478cd1ee605167ff82995n
      ]
    ].map((pair) => new Fp2(pair));
    var xnum = [
      [
        0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6n,
        0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6n
      ],
      [
        0x0n,
        0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71an
      ],
      [
        0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71en,
        0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38dn
      ],
      [
        0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1n,
        0x0n
      ]
    ].map((pair) => new Fp2(pair));
    var xden = [
      [
        0x0n,
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63n
      ],
      [
        0xcn,
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9fn
      ],
      [0x1n, 0x0n],
      [0x0n, 0x0n]
    ].map((pair) => new Fp2(pair));
    var ynum = [
      [
        0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706n,
        0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706n
      ],
      [
        0x0n,
        0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97ben
      ],
      [
        0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71cn,
        0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38fn
      ],
      [
        0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10n,
        0x0n
      ]
    ].map((pair) => new Fp2(pair));
    var yden = [
      [
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fbn,
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fbn
      ],
      [
        0x0n,
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3n
      ],
      [
        0x12n,
        0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99n
      ],
      [0x1n, 0x0n]
    ].map((pair) => new Fp2(pair));
    var ISOGENY_COEFFICIENTS = [xnum, xden, ynum, yden];
  }
});

// node_modules/@noble/bls12-381/index.js
var require_bls12_381 = __commonJS({
  "node_modules/@noble/bls12-381/index.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyBatch = exports.aggregateSignatures = exports.aggregatePublicKeys = exports.verify = exports.sign = exports.getPublicKey = exports.pairing = exports.PointG2 = exports.PointG1 = exports.utils = exports.CURVE = exports.Fp12 = exports.Fp2 = exports.Fr = exports.Fp = void 0;
    var math_1 = require_math();
    Object.defineProperty(exports, "Fp", { enumerable: true, get: function() {
      return math_1.Fp;
    } });
    Object.defineProperty(exports, "Fr", { enumerable: true, get: function() {
      return math_1.Fr;
    } });
    Object.defineProperty(exports, "Fp2", { enumerable: true, get: function() {
      return math_1.Fp2;
    } });
    Object.defineProperty(exports, "Fp12", { enumerable: true, get: function() {
      return math_1.Fp12;
    } });
    Object.defineProperty(exports, "CURVE", { enumerable: true, get: function() {
      return math_1.CURVE;
    } });
    var POW_2_381 = 2n ** 381n;
    var POW_2_382 = POW_2_381 * 2n;
    var POW_2_383 = POW_2_382 * 2n;
    var PUBLIC_KEY_LENGTH = 48;
    var SHA256_DIGEST_SIZE = 32;
    var htfDefaults = {
      DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
      p: math_1.CURVE.P,
      m: 2,
      k: 128,
      expand: true
    };
    function isWithinCurveOrder(num) {
      return 0 < num && num < math_1.CURVE.r;
    }
    var crypto2 = (() => {
      const webCrypto = typeof self === "object" && "crypto" in self ? self.crypto : void 0;
      const nodeRequire = typeof module2 !== "undefined" && typeof require === "function";
      return {
        node: nodeRequire && !webCrypto ? require("crypto") : void 0,
        web: webCrypto
      };
    })();
    exports.utils = {
      hashToField: hash_to_field,
      randomBytes: (bytesLength = 32) => {
        if (crypto2.web) {
          return crypto2.web.getRandomValues(new Uint8Array(bytesLength));
        } else if (crypto2.node) {
          const { randomBytes } = crypto2.node;
          return new Uint8Array(randomBytes(bytesLength).buffer);
        } else {
          throw new Error("The environment doesn't have randomBytes function");
        }
      },
      randomPrivateKey: () => {
        let i = 8;
        while (i--) {
          const b32 = exports.utils.randomBytes(32);
          const num = bytesToNumberBE(b32);
          if (isWithinCurveOrder(num) && num !== 1n)
            return b32;
        }
        throw new Error("Valid private key was not found in 8 iterations. PRNG is broken");
      },
      sha256: async (message) => {
        if (crypto2.web) {
          const buffer = await crypto2.web.subtle.digest("SHA-256", message.buffer);
          return new Uint8Array(buffer);
        } else if (crypto2.node) {
          return Uint8Array.from(crypto2.node.createHash("sha256").update(message).digest());
        } else {
          throw new Error("The environment doesn't have sha256 function");
        }
      },
      mod: math_1.mod,
      getDSTLabel() {
        return htfDefaults.DST;
      },
      setDSTLabel(newLabel) {
        if (typeof newLabel !== "string" || newLabel.length > 2048 || newLabel.length === 0) {
          throw new TypeError("Invalid DST");
        }
        htfDefaults.DST = newLabel;
      }
    };
    function bytesToNumberBE(bytes) {
      let value = 0n;
      for (let i = bytes.length - 1, j = 0; i >= 0; i--, j++) {
        value += (BigInt(bytes[i]) & 255n) << 8n * BigInt(j);
      }
      return value;
    }
    function bytesToHex(uint8a) {
      let hex = "";
      for (let i = 0; i < uint8a.length; i++) {
        hex += uint8a[i].toString(16).padStart(2, "0");
      }
      return hex;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string") {
        throw new TypeError("hexToBytes: expected string, got " + typeof hex);
      }
      if (hex.length % 2)
        throw new Error("hexToBytes: received invalid unpadded hex");
      const array = new Uint8Array(hex.length / 2);
      for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        array[i] = Number.parseInt(hex.slice(j, j + 2), 16);
      }
      return array;
    }
    function toPaddedHex(num, padding) {
      if (num < 0n)
        throw new Error("Expected valid number");
      if (typeof padding !== "number")
        throw new TypeError("Expected valid padding");
      return num.toString(16).padStart(padding * 2, "0");
    }
    function ensureBytes(hex) {
      if (hex instanceof Uint8Array)
        return hex;
      if (typeof hex === "string")
        return hexToBytes(hex);
      throw new TypeError("Expected hex string or Uint8Array");
    }
    function concatBytes(...arrays) {
      if (arrays.length === 1)
        return arrays[0];
      const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
      const result = new Uint8Array(length2);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
      }
      return result;
    }
    function stringToBytes(str) {
      const bytes = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
      }
      return bytes;
    }
    function os2ip(bytes) {
      let result = 0n;
      for (let i = 0; i < bytes.length; i++) {
        result <<= 8n;
        result += BigInt(bytes[i]);
      }
      return result;
    }
    function i2osp(value, length2) {
      if (value < 0 || value >= 1 << 8 * length2) {
        throw new Error(`bad I2OSP call: value=${value} length=${length2}`);
      }
      const res = Array.from({ length: length2 }).fill(0);
      for (let i = length2 - 1; i >= 0; i--) {
        res[i] = value & 255;
        value >>>= 8;
      }
      return new Uint8Array(res);
    }
    function strxor(a, b) {
      const arr = new Uint8Array(a.length);
      for (let i = 0; i < a.length; i++) {
        arr[i] = a[i] ^ b[i];
      }
      return arr;
    }
    async function expand_message_xmd(msg, DST, lenInBytes) {
      const H = exports.utils.sha256;
      const b_in_bytes = SHA256_DIGEST_SIZE;
      const r_in_bytes = b_in_bytes * 2;
      const ell = Math.ceil(lenInBytes / b_in_bytes);
      if (ell > 255)
        throw new Error("Invalid xmd length");
      const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
      const Z_pad = i2osp(0, r_in_bytes);
      const l_i_b_str = i2osp(lenInBytes, 2);
      const b = new Array(ell);
      const b_0 = await H(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
      b[0] = await H(concatBytes(b_0, i2osp(1, 1), DST_prime));
      for (let i = 1; i <= ell; i++) {
        const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
        b[i] = await H(concatBytes(...args));
      }
      const pseudo_random_bytes = concatBytes(...b);
      return pseudo_random_bytes.slice(0, lenInBytes);
    }
    async function hash_to_field(msg, count, options = {}) {
      const htfOptions = { ...htfDefaults, ...options };
      const log2p = htfOptions.p.toString(2).length;
      const L = Math.ceil((log2p + htfOptions.k) / 8);
      const len_in_bytes = count * htfOptions.m * L;
      const DST = stringToBytes(htfOptions.DST);
      let pseudo_random_bytes = msg;
      if (htfOptions.expand) {
        pseudo_random_bytes = await expand_message_xmd(msg, DST, len_in_bytes);
      }
      const u = new Array(count);
      for (let i = 0; i < count; i++) {
        const e = new Array(htfOptions.m);
        for (let j = 0; j < htfOptions.m; j++) {
          const elm_offset = L * (j + i * htfOptions.m);
          const tv = pseudo_random_bytes.slice(elm_offset, elm_offset + L);
          e[j] = (0, math_1.mod)(os2ip(tv), htfOptions.p);
        }
        u[i] = e;
      }
      return u;
    }
    function normalizePrivKey(key) {
      let int;
      if (key instanceof Uint8Array && key.length === 32)
        int = bytesToNumberBE(key);
      else if (typeof key === "string" && key.length === 64)
        int = BigInt(`0x${key}`);
      else if (typeof key === "number" && key > 0 && Number.isSafeInteger(key))
        int = BigInt(key);
      else if (typeof key === "bigint" && key > 0n)
        int = key;
      else
        throw new TypeError("Expected valid private key");
      int = (0, math_1.mod)(int, math_1.CURVE.r);
      if (!isWithinCurveOrder(int))
        throw new Error("Private key must be 0 < key < CURVE.r");
      return int;
    }
    function assertType(item, type) {
      if (!(item instanceof type))
        throw new Error("Expected Fp* argument, not number/bigint");
    }
    var PointG1 = class extends math_1.ProjectivePoint {
      constructor(x, y, z = math_1.Fp.ONE) {
        super(x, y, z, math_1.Fp);
        assertType(x, math_1.Fp);
        assertType(y, math_1.Fp);
        assertType(z, math_1.Fp);
      }
      static fromHex(bytes) {
        bytes = ensureBytes(bytes);
        const { P } = math_1.CURVE;
        let point;
        if (bytes.length === 48) {
          const compressedValue = bytesToNumberBE(bytes);
          const bflag = (0, math_1.mod)(compressedValue, POW_2_383) / POW_2_382;
          if (bflag === 1n) {
            return this.ZERO;
          }
          const x = new math_1.Fp((0, math_1.mod)(compressedValue, POW_2_381));
          const right = x.pow(3n).add(new math_1.Fp(math_1.CURVE.b));
          let y = right.sqrt();
          if (!y)
            throw new Error("Invalid compressed G1 point");
          const aflag = (0, math_1.mod)(compressedValue, POW_2_382) / POW_2_381;
          if (y.value * 2n / P !== aflag)
            y = y.negate();
          point = new PointG1(x, y);
        } else if (bytes.length === 96) {
          if ((bytes[0] & 1 << 6) !== 0)
            return PointG1.ZERO;
          const x = bytesToNumberBE(bytes.slice(0, PUBLIC_KEY_LENGTH));
          const y = bytesToNumberBE(bytes.slice(PUBLIC_KEY_LENGTH));
          point = new PointG1(new math_1.Fp(x), new math_1.Fp(y));
        } else {
          throw new Error("Invalid point G1, expected 48/96 bytes");
        }
        point.assertValidity();
        return point;
      }
      static fromPrivateKey(privateKey) {
        return this.BASE.multiplyPrecomputed(normalizePrivKey(privateKey));
      }
      toRawBytes(isCompressed = false) {
        return hexToBytes(this.toHex(isCompressed));
      }
      toHex(isCompressed = false) {
        this.assertValidity();
        const { P } = math_1.CURVE;
        if (isCompressed) {
          let hex;
          if (this.isZero()) {
            hex = POW_2_383 + POW_2_382;
          } else {
            const [x, y] = this.toAffine();
            const flag = y.value * 2n / P;
            hex = x.value + flag * POW_2_381 + POW_2_383;
          }
          return toPaddedHex(hex, PUBLIC_KEY_LENGTH);
        } else {
          if (this.isZero()) {
            return "4".padEnd(2 * 2 * PUBLIC_KEY_LENGTH, "0");
          } else {
            const [x, y] = this.toAffine();
            return toPaddedHex(x.value, PUBLIC_KEY_LENGTH) + toPaddedHex(y.value, PUBLIC_KEY_LENGTH);
          }
        }
      }
      assertValidity() {
        if (this.isZero())
          return this;
        if (!this.isOnCurve())
          throw new Error("Invalid G1 point: not on curve Fp");
        if (!this.isTorsionFree())
          throw new Error("Invalid G1 point: must be of prime-order subgroup");
        return this;
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return this.toString();
      }
      millerLoop(P) {
        return (0, math_1.millerLoop)(P.pairingPrecomputes(), this.toAffine());
      }
      clearCofactor() {
        return this.multiplyUnsafe(math_1.CURVE.h);
      }
      isOnCurve() {
        const b = new math_1.Fp(math_1.CURVE.b);
        const { x, y, z } = this;
        const left = y.pow(2n).multiply(z).subtract(x.pow(3n));
        const right = b.multiply(z.pow(3n));
        return left.subtract(right).isZero();
      }
      sigma() {
        const BETA = 0x1a0111ea397fe699ec02408663d4de85aa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaacn;
        const [x, y] = this.toAffine();
        return new PointG1(x.multiply(BETA), y);
      }
      isTorsionFree() {
        const c1 = 0x396c8c005555e1560000000055555555n;
        const P = this;
        const S = P.sigma();
        const Q = S.double();
        const S2 = S.sigma();
        const left = Q.subtract(P).subtract(S2).multiplyUnsafe(c1);
        const C = left.subtract(S2);
        return C.isZero();
      }
    };
    exports.PointG1 = PointG1;
    PointG1.BASE = new PointG1(new math_1.Fp(math_1.CURVE.Gx), new math_1.Fp(math_1.CURVE.Gy), math_1.Fp.ONE);
    PointG1.ZERO = new PointG1(math_1.Fp.ONE, math_1.Fp.ONE, math_1.Fp.ZERO);
    var PointG2 = class extends math_1.ProjectivePoint {
      constructor(x, y, z = math_1.Fp2.ONE) {
        super(x, y, z, math_1.Fp2);
        assertType(x, math_1.Fp2);
        assertType(y, math_1.Fp2);
        assertType(z, math_1.Fp2);
      }
      static async hashToCurve(msg) {
        msg = ensureBytes(msg);
        const u = await hash_to_field(msg, 2);
        const Q0 = new PointG2(...(0, math_1.isogenyMapG2)((0, math_1.map_to_curve_simple_swu_9mod16)(u[0])));
        const Q1 = new PointG2(...(0, math_1.isogenyMapG2)((0, math_1.map_to_curve_simple_swu_9mod16)(u[1])));
        const R = Q0.add(Q1);
        const P = R.clearCofactor();
        return P;
      }
      static fromSignature(hex) {
        hex = ensureBytes(hex);
        const { P } = math_1.CURVE;
        const half = hex.length / 2;
        if (half !== 48 && half !== 96)
          throw new Error("Invalid compressed signature length, must be 96 or 192");
        const z1 = bytesToNumberBE(hex.slice(0, half));
        const z2 = bytesToNumberBE(hex.slice(half));
        const bflag1 = (0, math_1.mod)(z1, POW_2_383) / POW_2_382;
        if (bflag1 === 1n)
          return this.ZERO;
        const x1 = z1 % POW_2_381;
        const x2 = z2;
        const x = new math_1.Fp2([x2, x1]);
        const y2 = x.pow(3n).add(new math_1.Fp2(math_1.CURVE.b2));
        let y = y2.sqrt();
        if (!y)
          throw new Error("Failed to find a square root");
        const [y0, y1] = y.values;
        const aflag1 = z1 % POW_2_382 / POW_2_381;
        const isGreater = y1 > 0n && y1 * 2n / P !== aflag1;
        const isZero = y1 === 0n && y0 * 2n / P !== aflag1;
        if (isGreater || isZero)
          y = y.multiply(-1n);
        const point = new PointG2(x, y, math_1.Fp2.ONE);
        point.assertValidity();
        return point;
      }
      static fromHex(bytes) {
        bytes = ensureBytes(bytes);
        let point;
        if (bytes.length === 96) {
          throw new Error("Compressed format not supported yet.");
        } else if (bytes.length === 192) {
          if ((bytes[0] & 1 << 6) !== 0) {
            return PointG2.ZERO;
          }
          const x1 = bytesToNumberBE(bytes.slice(0, PUBLIC_KEY_LENGTH));
          const x0 = bytesToNumberBE(bytes.slice(PUBLIC_KEY_LENGTH, 2 * PUBLIC_KEY_LENGTH));
          const y1 = bytesToNumberBE(bytes.slice(2 * PUBLIC_KEY_LENGTH, 3 * PUBLIC_KEY_LENGTH));
          const y0 = bytesToNumberBE(bytes.slice(3 * PUBLIC_KEY_LENGTH));
          point = new PointG2(new math_1.Fp2([x0, x1]), new math_1.Fp2([y0, y1]));
        } else {
          throw new Error("Invalid uncompressed point G2, expected 192 bytes");
        }
        point.assertValidity();
        return point;
      }
      static fromPrivateKey(privateKey) {
        return this.BASE.multiplyPrecomputed(normalizePrivKey(privateKey));
      }
      toSignature() {
        if (this.equals(PointG2.ZERO)) {
          const sum = POW_2_383 + POW_2_382;
          return toPaddedHex(sum, PUBLIC_KEY_LENGTH) + toPaddedHex(0n, PUBLIC_KEY_LENGTH);
        }
        const [[x0, x1], [y0, y1]] = this.toAffine().map((a) => a.values);
        const tmp = y1 > 0n ? y1 * 2n : y0 * 2n;
        const aflag1 = tmp / math_1.CURVE.P;
        const z1 = x1 + aflag1 * POW_2_381 + POW_2_383;
        const z2 = x0;
        return toPaddedHex(z1, PUBLIC_KEY_LENGTH) + toPaddedHex(z2, PUBLIC_KEY_LENGTH);
      }
      toRawBytes(isCompressed = false) {
        return hexToBytes(this.toHex(isCompressed));
      }
      toHex(isCompressed = false) {
        this.assertValidity();
        if (isCompressed) {
          throw new Error("Point compression has not yet been implemented");
        } else {
          if (this.equals(PointG2.ZERO)) {
            return "4".padEnd(2 * 4 * PUBLIC_KEY_LENGTH, "0");
          }
          const [[x0, x1], [y0, y1]] = this.toAffine().map((a) => a.values);
          return toPaddedHex(x1, PUBLIC_KEY_LENGTH) + toPaddedHex(x0, PUBLIC_KEY_LENGTH) + toPaddedHex(y1, PUBLIC_KEY_LENGTH) + toPaddedHex(y0, PUBLIC_KEY_LENGTH);
        }
      }
      assertValidity() {
        if (this.isZero())
          return this;
        if (!this.isOnCurve())
          throw new Error("Invalid G2 point: not on curve Fp2");
        if (!this.isTorsionFree())
          throw new Error("Invalid G2 point: must be of prime-order subgroup");
        return this;
      }
      psi() {
        return this.fromAffineTuple((0, math_1.psi)(...this.toAffine()));
      }
      psi2() {
        return this.fromAffineTuple((0, math_1.psi2)(...this.toAffine()));
      }
      mulNegX() {
        return this.multiplyUnsafe(math_1.CURVE.x).negate();
      }
      clearCofactor() {
        const P = this;
        let t1 = P.mulNegX();
        let t2 = P.psi();
        let t3 = P.double();
        t3 = t3.psi2();
        t3 = t3.subtract(t2);
        t2 = t1.add(t2);
        t2 = t2.mulNegX();
        t3 = t3.add(t2);
        t3 = t3.subtract(t1);
        const Q = t3.subtract(P);
        return Q;
      }
      isOnCurve() {
        const b = new math_1.Fp2(math_1.CURVE.b2);
        const { x, y, z } = this;
        const left = y.pow(2n).multiply(z).subtract(x.pow(3n));
        const right = b.multiply(z.pow(3n));
        return left.subtract(right).isZero();
      }
      isTorsionFree() {
        const P = this;
        const psi2 = P.psi2();
        const psi3 = psi2.psi();
        const zPsi3 = psi3.mulNegX();
        return zPsi3.subtract(psi2).add(P).isZero();
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return this.toString();
      }
      clearPairingPrecomputes() {
        this._PPRECOMPUTES = void 0;
      }
      pairingPrecomputes() {
        if (this._PPRECOMPUTES)
          return this._PPRECOMPUTES;
        this._PPRECOMPUTES = (0, math_1.calcPairingPrecomputes)(...this.toAffine());
        return this._PPRECOMPUTES;
      }
    };
    exports.PointG2 = PointG2;
    PointG2.BASE = new PointG2(new math_1.Fp2(math_1.CURVE.G2x), new math_1.Fp2(math_1.CURVE.G2y), math_1.Fp2.ONE);
    PointG2.ZERO = new PointG2(math_1.Fp2.ONE, math_1.Fp2.ONE, math_1.Fp2.ZERO);
    function pairing(P, Q, withFinalExponent = true) {
      if (P.isZero() || Q.isZero())
        throw new Error("No pairings at point of Infinity");
      P.assertValidity();
      Q.assertValidity();
      const looped = P.millerLoop(Q);
      return withFinalExponent ? looped.finalExponentiate() : looped;
    }
    exports.pairing = pairing;
    function normP1(point) {
      return point instanceof PointG1 ? point : PointG1.fromHex(point);
    }
    function normP2(point) {
      return point instanceof PointG2 ? point : PointG2.fromSignature(point);
    }
    async function normP2Hash(point) {
      return point instanceof PointG2 ? point : PointG2.hashToCurve(point);
    }
    function getPublicKey(privateKey) {
      const bytes = PointG1.fromPrivateKey(privateKey).toRawBytes(true);
      return typeof privateKey === "string" ? bytesToHex(bytes) : bytes;
    }
    exports.getPublicKey = getPublicKey;
    async function sign(message, privateKey) {
      const msgPoint = await normP2Hash(message);
      msgPoint.assertValidity();
      const sigPoint = msgPoint.multiply(normalizePrivKey(privateKey));
      if (message instanceof PointG2)
        return sigPoint;
      const hex = sigPoint.toSignature();
      return typeof message === "string" ? hex : hexToBytes(hex);
    }
    exports.sign = sign;
    async function verify2(signature, message, publicKey) {
      const P = normP1(publicKey);
      const Hm = await normP2Hash(message);
      const G = PointG1.BASE;
      const S = normP2(signature);
      const ePHm = pairing(P.negate(), Hm, false);
      const eGS = pairing(G, S, false);
      const exp = eGS.multiply(ePHm).finalExponentiate();
      return exp.equals(math_1.Fp12.ONE);
    }
    exports.verify = verify2;
    function aggregatePublicKeys(publicKeys) {
      if (!publicKeys.length)
        throw new Error("Expected non-empty array");
      const agg = publicKeys.map(normP1).reduce((sum, p) => sum.add(p), PointG1.ZERO);
      if (publicKeys[0] instanceof PointG1)
        return agg.assertValidity();
      const bytes = agg.toRawBytes(true);
      if (publicKeys[0] instanceof Uint8Array)
        return bytes;
      return bytesToHex(bytes);
    }
    exports.aggregatePublicKeys = aggregatePublicKeys;
    function aggregateSignatures(signatures) {
      if (!signatures.length)
        throw new Error("Expected non-empty array");
      const agg = signatures.map(normP2).reduce((sum, s) => sum.add(s), PointG2.ZERO);
      if (signatures[0] instanceof PointG2)
        return agg.assertValidity();
      const bytes = agg.toSignature();
      if (signatures[0] instanceof Uint8Array)
        return hexToBytes(bytes);
      return bytes;
    }
    exports.aggregateSignatures = aggregateSignatures;
    async function verifyBatch(signature, messages, publicKeys) {
      if (!messages.length)
        throw new Error("Expected non-empty messages array");
      if (publicKeys.length !== messages.length)
        throw new Error("Pubkey count should equal msg count");
      const sig = normP2(signature);
      const nMessages = await Promise.all(messages.map(normP2Hash));
      const nPublicKeys = publicKeys.map(normP1);
      try {
        const paired = [];
        for (const message of new Set(nMessages)) {
          const groupPublicKey = nMessages.reduce((groupPublicKey2, subMessage, i) => subMessage === message ? groupPublicKey2.add(nPublicKeys[i]) : groupPublicKey2, PointG1.ZERO);
          paired.push(pairing(groupPublicKey, message, false));
        }
        paired.push(pairing(PointG1.BASE.negate(), sig, false));
        const product = paired.reduce((a, b) => a.multiply(b), math_1.Fp12.ONE);
        const exp = product.finalExponentiate();
        return exp.equals(math_1.Fp12.ONE);
      } catch {
        return false;
      }
    }
    exports.verifyBatch = verifyBatch;
    PointG1.BASE.calcMultiplyPrecomputes(4);
  }
});

// index.js
var lit_jwt_verifier_exports = {};
__export(lit_jwt_verifier_exports, {
  NETWORK_PUB_KEY: () => NETWORK_PUB_KEY,
  verifyJwt: () => verifyJwt
});

// node_modules/multiformats/esm/src/bases/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});

// node_modules/multiformats/esm/vendor/base-x.js
function base(ALPHABET, name) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode3(source) {
    if (source instanceof Uint8Array)
      ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length2 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length2) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      pbegin++;
    }
    var it2 = size - length2;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length2) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length2;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode5(string2) {
    var buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name} character`);
  }
  return {
    encode: encode3,
    decodeUnsafe,
    decode: decode5
  };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/multiformats/esm/src/bytes.js
var empty = new Uint8Array(0);
var equals = (aa, bb) => {
  if (aa === bb)
    return true;
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
};
var coerce = (o) => {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
};
var fromString = (str) => new TextEncoder().encode(str);
var toString = (b) => new TextDecoder().decode(b);

// node_modules/multiformats/esm/src/bases/base.js
var Encoder = class {
  constructor(name, prefix, baseEncode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder = class {
  constructor(name, prefix, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    this.baseDecode = baseDecode;
  }
  decode(text) {
    if (typeof text === "string") {
      switch (text[0]) {
        case this.prefix: {
          return this.baseDecode(text.slice(1));
        }
        default: {
          throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
        }
      }
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  or(decoder) {
    return or(this, decoder);
  }
};
var ComposedDecoder = class {
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or(this, decoder);
  }
  decode(input) {
    const prefix = input[0];
    const decoder = this.decoders[prefix];
    if (decoder) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
var or = (left, right) => new ComposedDecoder({
  ...left.decoders || { [left.prefix]: left },
  ...right.decoders || { [right.prefix]: right }
});
var Codec = class {
  constructor(name, prefix, baseEncode, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name, prefix, baseEncode);
    this.decoder = new Decoder(name, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
var from = ({ name, prefix, encode: encode3, decode: decode5 }) => new Codec(name, prefix, encode3, decode5);
var baseX = ({ prefix, name, alphabet }) => {
  const { encode: encode3, decode: decode5 } = base_x_default(alphabet, name);
  return from({
    prefix,
    name,
    encode: encode3,
    decode: (text) => coerce(decode5(text))
  });
};
var decode = (string2, alphabet, bitsPerChar, name) => {
  const codes = {};
  for (let i = 0; i < alphabet.length; ++i) {
    codes[alphabet[i]] = i;
  }
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string2[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name} character`);
    }
    buffer = buffer << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= bitsPerChar || 255 & buffer << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
};
var encode = (data, alphabet, bitsPerChar) => {
  const pad = alphabet[alphabet.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet[mask & buffer >> bits];
    }
  }
  if (bits) {
    out += alphabet[mask & buffer << bitsPerChar - bits];
  }
  if (pad) {
    while (out.length * bitsPerChar & 7) {
      out += "=";
    }
  }
  return out;
};
var rfc4648 = ({ name, prefix, bitsPerChar, alphabet }) => {
  return from({
    prefix,
    name,
    encode(input) {
      return encode(input, alphabet, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabet, bitsPerChar, name);
    }
  });
};

// node_modules/multiformats/esm/src/bases/identity.js
var identity = from({
  prefix: "\0",
  name: "identity",
  encode: (buf) => toString(buf),
  decode: (str) => fromString(str)
});

// node_modules/multiformats/esm/src/bases/base2.js
var base2_exports = {};
__export(base2_exports, {
  base2: () => base2
});
var base2 = rfc4648({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/multiformats/esm/src/bases/base8.js
var base8_exports = {};
__export(base8_exports, {
  base8: () => base8
});
var base8 = rfc4648({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/multiformats/esm/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
});
var base10 = baseX({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/multiformats/esm/src/bases/base16.js
var base16_exports = {};
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper
});
var base16 = rfc4648({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper = rfc4648({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/multiformats/esm/src/bases/base32.js
var base32_exports = {};
__export(base32_exports, {
  base32: () => base32,
  base32hex: () => base32hex,
  base32hexpad: () => base32hexpad,
  base32hexpadupper: () => base32hexpadupper,
  base32hexupper: () => base32hexupper,
  base32pad: () => base32pad,
  base32padupper: () => base32padupper,
  base32upper: () => base32upper,
  base32z: () => base32z
});
var base32 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/multiformats/esm/src/bases/base36.js
var base36_exports = {};
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper
});
var base36 = baseX({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/multiformats/esm/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr
});
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/multiformats/esm/src/bases/base64.js
var base64_exports = {};
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad
});
var base64 = rfc4648({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc4648({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc4648({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc4648({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/multiformats/esm/src/hashes/sha2.js
var sha2_exports = {};
__export(sha2_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});
var import_crypto = __toESM(require("crypto"), 1);

// node_modules/multiformats/esm/vendor/varint.js
var encode_1 = encode2;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode2(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode2.bytes = offset - oldOffset + 1;
  return out;
}
var decode2 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode: decode2,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/multiformats/esm/src/varint.js
var decode3 = (data) => {
  const code = varint_default.decode(data);
  return [
    code,
    varint_default.decode.bytes
  ];
};
var encodeTo = (int, target, offset = 0) => {
  varint_default.encode(int, target, offset);
  return target;
};
var encodingLength = (int) => {
  return varint_default.encodingLength(int);
};

// node_modules/multiformats/esm/src/hashes/digest.js
var create = (code, digest) => {
  const size = digest.byteLength;
  const sizeOffset = encodingLength(code);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);
  return new Digest(code, size, digest, bytes);
};
var decode4 = (multihash) => {
  const bytes = coerce(multihash);
  const [code, sizeOffset] = decode3(bytes);
  const [size, digestOffset] = decode3(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);
  if (digest.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code, size, digest, bytes);
};
var equals2 = (a, b) => {
  if (a === b) {
    return true;
  } else {
    return a.code === b.code && a.size === b.size && equals(a.bytes, b.bytes);
  }
};
var Digest = class {
  constructor(code, size, digest, bytes) {
    this.code = code;
    this.size = size;
    this.digest = digest;
    this.bytes = bytes;
  }
};

// node_modules/multiformats/esm/src/hashes/hasher.js
var from2 = ({ name, code, encode: encode3 }) => new Hasher(name, code, encode3);
var Hasher = class {
  constructor(name, code, encode3) {
    this.name = name;
    this.code = code;
    this.encode = encode3;
  }
  async digest(input) {
    if (input instanceof Uint8Array) {
      const digest = await this.encode(input);
      return create(this.code, digest);
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/multiformats/esm/src/hashes/sha2.js
var sha256 = from2({
  name: "sha2-256",
  code: 18,
  encode: (input) => coerce(import_crypto.default.createHash("sha256").update(input).digest())
});
var sha512 = from2({
  name: "sha2-512",
  code: 19,
  encode: (input) => coerce(import_crypto.default.createHash("sha512").update(input).digest())
});

// node_modules/multiformats/esm/src/hashes/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});
var identity2 = from2({
  name: "identity",
  code: 0,
  encode: (input) => coerce(input)
});

// node_modules/multiformats/esm/src/codecs/json.js
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();

// node_modules/multiformats/esm/src/cid.js
var CID = class {
  constructor(version2, code, multihash, bytes) {
    this.code = code;
    this.version = version2;
    this.multihash = multihash;
    this.bytes = bytes;
    this.byteOffset = bytes.byteOffset;
    this.byteLength = bytes.byteLength;
    this.asCID = this;
    this._baseCache = /* @__PURE__ */ new Map();
    Object.defineProperties(this, {
      byteOffset: hidden,
      byteLength: hidden,
      code: readonly,
      version: readonly,
      multihash: readonly,
      bytes: readonly,
      _baseCache: hidden,
      asCID: hidden
    });
  }
  toV0() {
    switch (this.version) {
      case 0: {
        return this;
      }
      default: {
        const { code, multihash } = this;
        if (code !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return CID.createV0(multihash);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code, digest } = this.multihash;
        const multihash = create(code, digest);
        return CID.createV1(this.code, multihash);
      }
      case 1: {
        return this;
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
      }
    }
  }
  equals(other) {
    return other && this.code === other.code && this.version === other.version && equals2(this.multihash, other.multihash);
  }
  toString(base3) {
    const { bytes, version: version2, _baseCache } = this;
    switch (version2) {
      case 0:
        return toStringV0(bytes, _baseCache, base3 || base58btc.encoder);
      default:
        return toStringV1(bytes, _baseCache, base3 || base32.encoder);
    }
  }
  toJSON() {
    return {
      code: this.code,
      version: this.version,
      hash: this.multihash.bytes
    };
  }
  get [Symbol.toStringTag]() {
    return "CID";
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return "CID(" + this.toString() + ")";
  }
  static isCID(value) {
    deprecate(/^0\.0/, IS_CID_DEPRECATION);
    return !!(value && (value[cidSymbol] || value.asCID === value));
  }
  get toBaseEncodedString() {
    throw new Error("Deprecated, use .toString()");
  }
  get codec() {
    throw new Error('"codec" property is deprecated, use integer "code" property instead');
  }
  get buffer() {
    throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead");
  }
  get multibaseName() {
    throw new Error('"multibaseName" property is deprecated');
  }
  get prefix() {
    throw new Error('"prefix" property is deprecated');
  }
  static asCID(value) {
    if (value instanceof CID) {
      return value;
    } else if (value != null && value.asCID === value) {
      const { version: version2, code, multihash, bytes } = value;
      return new CID(version2, code, multihash, bytes || encodeCID(version2, code, multihash.bytes));
    } else if (value != null && value[cidSymbol] === true) {
      const { version: version2, multihash, code } = value;
      const digest = decode4(multihash);
      return CID.create(version2, code, digest);
    } else {
      return null;
    }
  }
  static create(version2, code, digest) {
    if (typeof code !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    switch (version2) {
      case 0: {
        if (code !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new CID(version2, code, digest, digest.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version2, code, digest.bytes);
        return new CID(version2, code, digest, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  static createV0(digest) {
    return CID.create(0, DAG_PB_CODE, digest);
  }
  static createV1(code, digest) {
    return CID.create(1, code, digest);
  }
  static decode(bytes) {
    const [cid, remainder] = CID.decodeFirst(bytes);
    if (remainder.length) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  static decodeFirst(bytes) {
    const specs = CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? CID.createV0(digest) : CID.createV1(specs.codec, digest);
    return [
      cid,
      bytes.subarray(specs.size)
    ];
  }
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length2] = decode3(initialBytes.subarray(offset));
      offset += length2;
      return i;
    };
    let version2 = next();
    let codec = DAG_PB_CODE;
    if (version2 === 18) {
      version2 = 0;
      offset = 0;
    } else if (version2 === 1) {
      codec = next();
    }
    if (version2 !== 0 && version2 !== 1) {
      throw new RangeError(`Invalid CID version ${version2}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return {
      version: version2,
      codec,
      multihashCode,
      digestSize,
      multihashSize,
      size
    };
  }
  static parse(source, base3) {
    const [prefix, bytes] = parseCIDtoBytes(source, base3);
    const cid = CID.decode(bytes);
    cid._baseCache.set(prefix, source);
    return cid;
  }
};
var parseCIDtoBytes = (source, base3) => {
  switch (source[0]) {
    case "Q": {
      const decoder = base3 || base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base3 || base58btc;
      return [
        base58btc.prefix,
        decoder.decode(source)
      ];
    }
    case base32.prefix: {
      const decoder = base3 || base32;
      return [
        base32.prefix,
        decoder.decode(source)
      ];
    }
    default: {
      if (base3 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [
        source[0],
        base3.decode(source)
      ];
    }
  }
};
var toStringV0 = (bytes, cache, base3) => {
  const { prefix } = base3;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes).slice(1);
    cache.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var toStringV1 = (bytes, cache, base3) => {
  const { prefix } = base3;
  const cid = cache.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes);
    cache.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
var encodeCID = (version2, code, multihash) => {
  const codeOffset = encodingLength(version2);
  const hashOffset = codeOffset + encodingLength(code);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version2, bytes, 0);
  encodeTo(code, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
};
var cidSymbol = Symbol.for("@ipld/js-cid/CID");
var readonly = {
  writable: false,
  configurable: false,
  enumerable: true
};
var hidden = {
  writable: false,
  enumerable: false,
  configurable: false
};
var version = "0.0.0-dev";
var deprecate = (range, message) => {
  if (range.test(version)) {
    console.warn(message);
  } else {
    throw new Error(message);
  }
};
var IS_CID_DEPRECATION = `CID.isCID(v) is deprecated and will be removed in the next major release.
Following code pattern:

if (CID.isCID(value)) {
  doSomethingWithCID(value)
}

Is replaced with:

const cid = CID.asCID(value)
if (cid) {
  // Make sure to use cid instead of value
  doSomethingWithCID(cid)
}
`;

// node_modules/multiformats/esm/src/basics.js
var bases = {
  ...identity_exports,
  ...base2_exports,
  ...base8_exports,
  ...base10_exports,
  ...base16_exports,
  ...base32_exports,
  ...base36_exports,
  ...base58_exports,
  ...base64_exports
};
var hashes = {
  ...sha2_exports,
  ...identity_exports2
};

// node_modules/uint8arrays/esm/src/util/bases.js
function createCodec(name, prefix, encode3, decode5) {
  return {
    name,
    prefix,
    encoder: {
      name,
      prefix,
      encode: encode3
    },
    decoder: { decode: decode5 }
  };
}
var string = createCodec("utf8", "u", (buf) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf) => {
  let string2 = "a";
  for (let i = 0; i < buf.length; i++) {
    string2 += String.fromCharCode(buf[i]);
  }
  return string2;
}, (str) => {
  str = str.substring(1);
  const buf = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
});
var BASES = {
  utf8: string,
  "utf-8": string,
  hex: bases.base16,
  latin1: ascii,
  ascii,
  binary: ascii,
  ...bases
};
var bases_default = BASES;

// node_modules/uint8arrays/esm/src/from-string.js
function fromString2(string2, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (!base3) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base3.decoder.decode(`${base3.prefix}${string2}`);
}

// node_modules/uint8arrays/esm/src/to-string.js
function toString2(array, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (!base3) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base3.encoder.encode(array).substring(1);
}

// index.js
var import_bls12_381 = __toESM(require_bls12_381());
var NETWORK_PUB_KEY = fromString2("9971e835a1fe1a4d78e381eebbe0ddc84fde5119169db816900de796d10187f3c53d65c1202ac083d099a517f34a9b62", "base16");
async function verifyJwt(jwt) {
  const jwtParts = jwt.split(".");
  const signature = fromString2(jwtParts[2], "base64url");
  const unsignedJwt = `${jwtParts[0]}.${jwtParts[1]}`;
  const message = fromString2(unsignedJwt);
  const header = JSON.parse(toString2(fromString2(jwtParts[0], "base64url")));
  const payload = JSON.parse(toString2(fromString2(jwtParts[1], "base64url")));
  let verified = false;
  if (header.alg === "BLS12-381" && header.typ === "JWT" && payload.iss === "LIT") {
    verified = await (0, import_bls12_381.verify)(signature, unsignedJwt, NETWORK_PUB_KEY);
  } else {
    console.log("Error verifying JWT.  Something is wrong with header.alg or header.typ or payload.iss.  header: ", header, "payload: ", payload);
  }
  if (Date.now() > payload.exp * 1e3) {
    console.log(`JWT has expired.  Expired at ${payload.exp * 1e3} and current time is ${Date.now()}`);
    verified = false;
  }
  return {
    verified,
    header,
    payload,
    signature
  };
}
module.exports = __toCommonJS(lit_jwt_verifier_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NETWORK_PUB_KEY,
  verifyJwt
});
/*! noble-bls12-381 - MIT License (c) Paul Miller (paulmillr.com) */
