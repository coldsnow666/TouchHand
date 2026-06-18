import {
    _decorator,
    Color,
    Component,
    easing,
    Graphics,
    Node,
    randomRange,
    randomRangeInt,
    tween,
    UIOpacity,
    UITransform,
    Vec3,
} from 'cc';

const { ccclass } = _decorator;

@ccclass('StartSceneEffects')
export class StartSceneEffects extends Component {
    private readonly designWidth = 960;
    private readonly designHeight = 640;
    private effectsLayer: Node | null = null;

    onLoad() {
        this.effectsLayer = this.ensureLayer('EffectsLayer');
        this.effectsLayer.setSiblingIndex(2);

        this.createFireflies();
        this.schedule(this.spawnLeaf, 5);
        this.spawnLeaf();
        this.startBearBreathing();
    }

    private ensureLayer(name: string) {
        let layer = this.node.getChildByName(name);
        if (!layer) {
            layer = new Node(name);
            layer.layer = this.node.layer;
            this.node.addChild(layer);
            const transform = layer.addComponent(UITransform);
            transform.setContentSize(this.designWidth, this.designHeight);
        }

        layer.setPosition(0, 0, 0);
        return layer;
    }

    private createFireflies() {
        if (!this.effectsLayer) {
            return;
        }

        for (let i = 0; i < 18; i++) {
            const firefly = new Node(`Firefly_${i + 1}`);
            firefly.layer = this.node.layer;
            this.effectsLayer.addChild(firefly);
            firefly.addComponent(UITransform).setContentSize(18, 18);

            const opacity = firefly.addComponent(UIOpacity);
            opacity.opacity = randomRangeInt(80, 170);

            const graphics = firefly.addComponent(Graphics);
            this.drawFirefly(graphics, randomRange(2.2, 4.2));

            firefly.setPosition(randomRange(-455, 455), randomRange(-275, 285), 0);
            this.floatFirefly(firefly, opacity);
        }
    }

    private drawFirefly(graphics: Graphics, radius: number) {
        graphics.clear();
        graphics.fillColor = new Color(75, 210, 255, 42);
        graphics.circle(0, 0, radius * 2.8);
        graphics.fill();
        graphics.fillColor = new Color(120, 235, 255, 150);
        graphics.circle(0, 0, radius * 1.5);
        graphics.fill();
        graphics.fillColor = new Color(220, 255, 255, 235);
        graphics.circle(0, 0, radius * 0.55);
        graphics.fill();
    }

    private floatFirefly(firefly: Node, opacity: UIOpacity) {
        const nextX = randomRange(-455, 455);
        const nextY = randomRange(-275, 285);
        const duration = randomRange(4.5, 8.5);
        const targetOpacity = randomRangeInt(70, 190);

        tween(firefly)
            .to(duration, { position: new Vec3(nextX, nextY, 0) }, { easing: easing.sineInOut })
            .call(() => this.floatFirefly(firefly, opacity))
            .start();

        tween(opacity)
            .to(duration * 0.5, { opacity: targetOpacity }, { easing: easing.sineInOut })
            .to(duration * 0.5, { opacity: randomRangeInt(65, 160) }, { easing: easing.sineInOut })
            .start();
    }

    private spawnLeaf = () => {
        if (!this.effectsLayer) {
            return;
        }

        const leaf = new Node('FallingLeaf');
        leaf.layer = this.node.layer;
        this.effectsLayer.addChild(leaf);
        leaf.addComponent(UITransform).setContentSize(26, 16);
        leaf.addComponent(UIOpacity).opacity = randomRangeInt(145, 220);

        const graphics = leaf.addComponent(Graphics);
        this.drawLeaf(graphics);

        const startX = randomRange(-420, 420);
        const endX = startX + randomRange(-105, 105);
        const startY = 350;
        const endY = randomRange(-330, -250);
        const duration = randomRange(7.5, 10.5);

        leaf.setPosition(startX, startY, 0);
        leaf.setRotationFromEuler(0, 0, randomRange(-35, 35));

        tween(leaf)
            .to(duration, { position: new Vec3(endX, endY, 0) }, { easing: easing.sineInOut })
            .call(() => leaf.destroy())
            .start();

        tween(leaf)
            .by(duration, { eulerAngles: new Vec3(0, 0, randomRange(210, 430)) }, { easing: easing.sineInOut })
            .start();
    };

    private drawLeaf(graphics: Graphics) {
        graphics.clear();
        graphics.fillColor = new Color(128, 176, 55, 210);
        graphics.moveTo(-12, 0);
        graphics.bezierCurveTo(-4, 10, 10, 9, 14, 0);
        graphics.bezierCurveTo(8, -8, -4, -9, -12, 0);
        graphics.fill();
        graphics.strokeColor = new Color(59, 92, 31, 190);
        graphics.lineWidth = 1.5;
        graphics.moveTo(-10, 0);
        graphics.lineTo(12, 0);
        graphics.stroke();
    }

    private startBearBreathing() {
        const bear = this.node.getChildByName('StartBear');
        if (!bear) {
            return;
        }

        const baseScale = bear.scale.clone();
        tween(bear)
            .repeatForever(
                tween()
                    .to(1.25, { scale: new Vec3(baseScale.x * 1.02, baseScale.y * 1.02, baseScale.z) }, { easing: easing.sineInOut })
                    .to(1.25, { scale: baseScale }, { easing: easing.sineInOut }),
            )
            .start();
    }
}
