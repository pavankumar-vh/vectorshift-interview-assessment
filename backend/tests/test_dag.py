from app.dag import is_dag


def test_is_dag_true():
    nodes = [{"id": "a"}, {"id": "b"}, {"id": "c"}]
    edges = [
        {"source": "a", "target": "b"},
        {"source": "b", "target": "c"},
    ]
    assert is_dag(nodes, edges) is True


def test_is_dag_false_cycle():
    nodes = [{"id": "a"}, {"id": "b"}]
    edges = [
        {"source": "a", "target": "b"},
        {"source": "b", "target": "a"},
    ]
    assert is_dag(nodes, edges) is False
