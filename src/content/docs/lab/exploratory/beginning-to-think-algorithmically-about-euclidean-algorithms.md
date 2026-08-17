---
title: Beginning to Think Algorithmically About Euclidean Algorithms
description: "A casual study note on using simple Python to represent prime testing and the Euclidean algorithm while working through Discrete Mathematics II."
contentType: entry
date: 2026-08-13
tags:
  - study-note
  - discrete-mathematics
  - number-theory
  - python
  - algorithms
  - prime-numbers
  - euclidean-algorithm
  - extended-euclidean-algorithm
draft: false
sidebar:
  order: 1
---

## A small connection from class

I have been running into the Euclidean and extended Euclidean algorithms in my Discrete Mathematics II class. Around the same time, I spent a couple of days playing with small number-related scripts in Python: checking whether a number was prime, finding a greatest common divisor, and generating longer lists of primes.

None of the programs became a large project. What I found satisfying was how little Python it took to represent a process that I had otherwise been working through on paper. A loop, a remainder, and a few changing variables were enough to make the mathematics move one step at a time.

## Starting with possible factors

My first prime-number script was deliberately talkative. It asked for one number and printed what happened as it tried each possible factor:

```python title="firstPrimeAlgo.py"
print("Choose a number")
input1 = int(input())
print (f"Number chosen: {input1}")
x = 2
while x < input1/2:
    if input1 % x == 0:
        print(f"{x} is a factor of {input1}, so the number is not prime")
        x += 1
        break
    else:
        print(f"{x} is not a factor of {input1}")
        x += 1
```

This version shows my initial reasoning more clearly than it solves the general problem. I was thinking: start at `2`, test the remainder, and keep moving until I either find a factor or run out of useful candidates.

It also has unfinished edges. It never prints a final conclusion when the input is prime, and an input such as `4` never enters the loop to test `2`. I am leaving those details visible here because this was the starting point, not the version I would write after reviewing it.

## Turning the idea into a reusable check

The later version separates the prime check from the act of iterating over a range:

```python title="algoplay.py"
def isPrime(x):
    if x <= 1:
        return False
    else:
        i = 2
        while i * i <= x:
            if x % i == 0:
                return False
            else:
                i += 1
        return True

def iterate(x, algo):
    results = []
    i = 2
    while i <= x:
        if algo(i):
            results.append(i)
            i += 1
        else:
            i += 1
    return results
```

The part I like most is the condition `i * i <= x`. If a number has a factor larger than its square root, the matching factor must be smaller than the square root. That means the loop does not need to search all the way to the number, or even halfway to it.

This was also a small shift in how I was thinking about the code. `isPrime()` answers one question about one number. `iterate()` can apply that question across a range and collect the numbers for which the answer is true.

I kept two outputs from this version. One contains the 1,229 primes up to 10,000; the other contains the 78,498 primes up to 1,000,000. The lists themselves are not especially interesting to read, but seeing a short function produce them was surprisingly satisfying.

## Seeing the square-root cutoff

This is purely a fascinating observation I made when going through this chapter. The `i * i <= x` condition also connects to something I later learned about called the **U-turn**, or **horseshoe**, **factor diagram**. When the factor pairs of a number are arranged from the outside inward, the small factors on one side pair with the large factors on the other:

```text title="Factor pairs of 36"
1  <->  36
2  <->  18
3  <->  12
4  <->   9
6  <->   6
```

The pairs turn back once they meet at the square root. For `36`, that meeting point is `6 × 6`. If a possible factor on the smaller side does not divide the number, there cannot be a new factor on the larger side without a smaller partner that should already have been found.

I had seen that relationship visually in the diagram, but the prime-checking loop gave me an algorithmic version of it. The diagram and the condition are describing the same cutoff in two different ways, which made the code feel more connected to the number theory than I first realized.

## The Euclidean algorithm fit naturally

My greatest-common-divisor script is similarly small:

```python title="findGCD.py"
print("Enter the first number")
first = int(input())
print("Enter the second number")
second = int(input())
x = first
y = second
if y < x:
    z = y
    y = x
    x = z
r = y % x
while r != 0:
    y = x
    x = r
    r = y % x
print(f"{x} is the GCD of {first} and {second}")
```

The program puts the smaller input in `x`, divides the larger by it, and keeps replacing the pair with the divisor and remainder. The work I might write by hand for `252` and `105` follows the same progression:

```text title="One Euclidean algorithm example"
252 = 2(105) + 42
105 = 2(42)  + 21
42  = 2(21)  + 0

gcd(252, 105) = 21
```

On paper, I follow the remainder down the page. In the script, `y`, `x`, and `r` move that same state through the loop. It is a plain implementation, but that is part of what made it click for me: the mathematical procedure already behaves like an algorithm.

## Extending the same trail backward

The extended Euclidean algorithm takes the same remainder chain and works back through it to express the greatest common divisor as a combination of the two starting numbers. For the example above, the back-substitution is:

```text title="Back-substitution"
21 = 105 - 2(42)
42 = 252 - 2(105)

21 = 105 - 2(252 - 2(105))
21 = 5(105) - 2(252)
```

One way I found to complete the idea in Python is to carry two pairs of coefficients alongside the remainders:

```python title="extended_euclidean.py"
def extended_gcd(a, b):
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1

    while r != 0:
        quotient = old_r // r
        old_r, r = r, old_r - quotient * r
        old_s, s = s, old_s - quotient * s
        old_t, t = t, old_t - quotient * t

    return old_r, old_s, old_t


gcd, x, y = extended_gcd(252, 105)
print(f"gcd: {gcd}")
print(f"coefficients: {x}, {y}")
print(f"check: 252({x}) + 105({y}) = {252 * x + 105 * y}")
```

```text title="Result"
gcd: 21
coefficients: -2, 5
check: 252(-2) + 105(5) = 21
```

Here, `old_r` eventually becomes the GCD while `old_s` and `old_t` become the coefficients multiplying the original inputs. The program is keeping track of the same substitutions that I would otherwise work backward by hand.

## A direction I want to keep exploring

These small examples seem to sit near several number-theory connections: factor pairs lead into primes, the Euclidean algorithm leads into greatest common divisors, and the extended version leads into **Bézout coefficients** and eventually things such as modular inverses. I do not know yet how far I will take any of this, but it feels like it could lead to some cool connections as I encounter more problems.

I want to keep asking the same questions when I see a mathematical process: what state needs to be remembered, what changes during one step, and what condition tells the process to stop? I would like to try this with more of the problems from discrete mathematics and, eventually, with math outside of that class too.

## Yeah, my Python is weird

This may not be the best code, but I am keeping it so I can come back and improve it one day. I like being able to see the process I went through here :D

