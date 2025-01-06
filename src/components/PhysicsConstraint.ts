import type { Entity } from 'excalibur';
import { Component, Observable } from 'excalibur';
import Matter from 'matter-js';

export default class PhysicsConstraint extends Component {
	public constraint: Matter.Constraint;
	public $removed = new Observable<PhysicsConstraint>();

	public constructor(public constraintDefinition: Matter.IConstraintDefinition) {
		super();
		this.constraint = Matter.Constraint.create(constraintDefinition);
	}

	public override onRemove(_: Entity): void {
		this.$removed.notifyAll(this);
	}
}
