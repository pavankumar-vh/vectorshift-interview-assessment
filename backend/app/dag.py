from collections import deque
from typing import Dict, List


def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    node_ids = {node.get("id") for node in nodes if node.get("id")}
    adjacency = {node_id: set() for node_id in node_ids}
    indegree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")

        if source in node_ids and target in node_ids and target not in adjacency[source]:
            adjacency[source].add(target)
            indegree[target] += 1

    queue = deque([node_id for node_id, degree in indegree.items() if degree == 0])
    visited = 0

    while queue:
        node_id = queue.popleft()
        visited += 1

        for neighbor in adjacency[node_id]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)
