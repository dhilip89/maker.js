﻿/// <reference path="maker.ts" />

module Maker.Point {

    /**
     * Add two points together and return the result as a new point object.
     * 
     * @param a First point, either as a point object, or as an array of numbers.
     * @param b Second point, either as a point object, or as an array of numbers.
     * @param subtract Optional boolean to subtract instead of add.
     * @returns A new point object.
     */
    export function Add(a: IMakerPoint, b: IMakerPoint, subtract?: boolean): IMakerPoint;
    export function Add(a: IMakerPoint, b: number[], subtract?: boolean): IMakerPoint;
    export function Add(a: number[], b: IMakerPoint, subtract?: boolean): IMakerPoint;
    export function Add(a: number[], b: number[], subtract?: boolean): IMakerPoint;
    export function Add(a: any, b: any, subtract = false): IMakerPoint {
        var p1 = Clone(Ensure(a));
        var p2 = Ensure(b);
        if (subtract) {
            p1.x -= p2.x;
            p1.y -= p2.y;
        } else {
            p1.x += p2.x;
            p1.y += p2.y;
        }
        return p1;
    }

    /**
     * Clone a point into a new point.
     * 
     * @param point The point to clone.
     * @returns A new point with same values as the original.
     */
    export function Clone(point: IMakerPoint): IMakerPoint {
        return { x: point.x, y: point.y };
    }

    /**
     * Ensures that an item has the properties of a point object.
     * 
     * @param point The item to ensure; may be a point object, or an array of numbers, or something else which will attempt to coerce into a point.
     * @returns A new point object either with the x, y values corresponding to the input, or 0,0 coordinates.
     */
    export function Ensure(point: IMakerPoint): IMakerPoint;
    export function Ensure(point: number[]): IMakerPoint;
    export function Ensure(): IMakerPoint;
    export function Ensure(item?: any): IMakerPoint {

        if (!item) {
            return Zero();
        }

        if (IsPoint(item)) {
            return item;
        }

        if (Array.isArray(item) && item.length > 1) {
            return { x: item[0], y: item[1] };
        }

        if (arguments.length > 1) {
            return { x: arguments[0], y: arguments[0] };
        }

        return Zero();
    }

    /**
     * Get a point from its polar coordinates.
     * 
     * @param angleInRadians The angle of the polar coordinate, in radians.
     * @param radius The radius of the polar coordinate.
     * @returns A new point object.
     */
    export function FromPolar(angleInRadians: number, radius: number): IMakerPoint {
        return {
            x: radius * Math.cos(angleInRadians),
            y: radius * Math.sin(angleInRadians)
        };
    }

    /**
     * Get the two end points of an arc path.
     * 
     * @param arc The arc path object.
     * @returns Array with 2 elements: [0] is the point object corresponding to the start angle, [1] is the point object corresponding to the end angle.
     */
    export function FromArc(arc: IMakerPathArc): IMakerPoint[] {

        function getPointFromAngle(angle: number) {
            return Add(arc.origin, FromPolar(Angle.ToRadians(angle), arc.radius));
        }

        return [getPointFromAngle(arc.startAngle), getPointFromAngle(arc.endAngle)];
    }

    /**
     * Create a clone of a point, mirrored on either or both x and y axes.
     * 
     * @param point The point to mirror.
     * @param mirrorX Boolean to mirror on the x axis.
     * @param mirrorY Boolean to mirror on the y axis.
     * @returns Mirrored point.
     */
    export function Mirror(point: IMakerPoint, mirrorX: boolean, mirrorY: boolean): IMakerPoint {
        var p = Clone(Ensure(point));

        if (mirrorX) {
            p.x = -p.x;
        }

        if (mirrorY) {
            p.y = -p.y;
        }

        return p;
    }

    /**
     * Rotate a point.
     * 
     * @param point The point to rotate.
     * @param angleInDegrees The amount of rotation, in degrees.
     * @param rotationOrigin The center point of rotation.
     * @returns A new point.
     */
    export function Rotate(point: IMakerPoint, angleInDegrees: number, rotationOrigin: IMakerPoint): IMakerPoint {
        var pointAngleInRadians = Angle.FromPointToRadians(point, rotationOrigin);
        var d = Measure.PointDistance(rotationOrigin, point);
        var rotatedPoint = FromPolar(pointAngleInRadians + Angle.ToRadians(angleInDegrees), d);

        return Add(rotationOrigin, rotatedPoint);
    }

    /**
     * Scale a point's coordinates.
     * 
     * @param point The point to scale.
     * @param scale The amount of scaling.
     * @returns A new point.
     */
    export function Scale(point: IMakerPoint, scale: number): IMakerPoint {
        var p = Clone(Ensure(point));
        p.x *= scale;
        p.y *= scale;
        return p;
    }

    /**
     * Subtract a point from another point, and return the result as a new point. Shortcut to Add(a, b, subtract = true).
     * 
     * @param a First point, either as a point object, or as an array of numbers.
     * @param b Second point, either as a point object, or as an array of numbers.
     * @returns A new point object.
     */
    export function Subtract(a: IMakerPoint, b: IMakerPoint): IMakerPoint;
    export function Subtract(a: IMakerPoint, b: number[]): IMakerPoint;
    export function Subtract(a: number[], b: IMakerPoint): IMakerPoint;
    export function Subtract(a: number[], b: number[]): IMakerPoint;
    export function Subtract(a: any, b: any): IMakerPoint {
        return Add(a, b, true);
    }

    /**
     * A point at 0,0 coordinates.
     * 
     * @returns A new point.
     */
    export function Zero(): IMakerPoint {
        return { x: 0, y: 0 };
    }

}